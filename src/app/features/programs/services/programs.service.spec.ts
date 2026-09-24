import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProgramsService } from './programs.service';
import { ProgramsApi } from './programs.api';
import { makeProgram } from '../testing/program-fixture';

describe('ProgramsService', () => {
  function setup(list: () => ReturnType<ProgramsApi['list']>) {
    TestBed.configureTestingModule({
      providers: [{ provide: ProgramsApi, useValue: { list } }],
    });
    return TestBed.inject(ProgramsService);
  }

  it('starts empty and idle', () => {
    const service = setup(() => of([]));
    expect(service.programs()).toEqual([]);
    expect(service.status()).toBe('idle');
  });

  it('holds exactly what the registry returns — no local fixture merged in', async () => {
    const remote = [makeProgram({ slug: 'a' }), makeProgram({ slug: 'b' })];
    const service = setup(() => of(remote));

    await service.load();

    expect(service.programs()).toEqual(remote);
    expect(service.status()).toBe('loaded');
  });

  it('is loading while the request is in flight', () => {
    const service = setup(() => of([]));
    let seen: string | undefined;
    TestBed.inject(ProgramsApi).list = () => {
      seen = service.status();
      return of([]);
    };

    void service.load();

    expect(seen).toBe('loading');
  });

  it('reports an error on a failed fetch and keeps any previously loaded list', async () => {
    let fail = false;
    const service = setup(() =>
      fail ? throwError(() => new Error('network down')) : of([makeProgram()]),
    );
    await service.load();

    fail = true;
    await service.load();

    expect(service.status()).toBe('error');
    expect(service.programs()).toHaveLength(1);
  });

  it('findLoaded returns a cached program by slug, or undefined', async () => {
    const service = setup(() => of([makeProgram({ slug: 'a' })]));
    await service.load();

    expect(service.findLoaded('a')?.slug).toBe('a');
    expect(service.findLoaded('missing')).toBeUndefined();
  });
});
