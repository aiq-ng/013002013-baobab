import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProgramsService } from './programs.service';
import { ProgramsApi } from './programs.api';
import { PROGRAMS } from '../data/programs.data';
import { RemoteProgram } from '../models/program';

describe('ProgramsService', () => {
  function setup(list: () => ReturnType<ProgramsApi['list']>) {
    TestBed.configureTestingModule({
      providers: [{ provide: ProgramsApi, useValue: { list } }],
    });
    return TestBed.inject(ProgramsService);
  }

  it('starts with the static fixture so the page never renders empty', () => {
    const service = setup(() => of([]));
    expect(service.programs()).toEqual(PROGRAMS);
  });

  it('merges the console-editable fields onto the matching static program by slug', async () => {
    const remote: RemoteProgram[] = [
      {
        slug: PROGRAMS[0].slug,
        sortOrder: 0,
        title: 'Updated Title',
        description: 'Updated description.',
        imageUrl: '/images/updated.jpg',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];
    const service = setup(() => of(remote));

    await service.load();

    const [first, ...rest] = service.programs();
    expect(first.title).toBe('Updated Title');
    expect(first.description).toBe('Updated description.');
    expect(first.imageUrl).toBe('/images/updated.jpg');
    // Unrelated fixed content untouched.
    expect(first.kpis).toEqual(PROGRAMS[0].kpis);
    expect(rest).toEqual(PROGRAMS.slice(1));
  });

  it('keeps the static fallback on a failed fetch', async () => {
    const service = setup(() => throwError(() => new Error('network down')));

    await service.load();

    expect(service.programs()).toEqual(PROGRAMS);
  });
});
