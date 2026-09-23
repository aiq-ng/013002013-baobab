import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProgramsApi } from './programs.api';
import { RemoteProgram } from '../models/program';

describe('ProgramsApi', () => {
  let api: ProgramsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ProgramsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('GETs /programs relative to the api base url', () => {
    const remote: RemoteProgram[] = [
      {
        slug: 'liptako-gourma-peace-corridor',
        sortOrder: 1,
        title: 'Liptako-Gourma Peace Corridor',
        description: 'Updated from the registry.',
        imageUrl: '/images/updated.jpg',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    let result: RemoteProgram[] | undefined;
    api.list().subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url.endsWith('/programs'));
    expect(req.request.method).toBe('GET');
    req.flush(remote);

    expect(result).toEqual(remote);
  });
});
