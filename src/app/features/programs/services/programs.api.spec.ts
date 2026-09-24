import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProgramsApi } from './programs.api';
import { Program } from '../models/program';
import { makeProgram } from '../testing/program-fixture';

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
    const remote = [makeProgram()];

    let result: Program[] | undefined;
    api.list().subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url.endsWith('/programs'));
    expect(req.request.method).toBe('GET');
    req.flush(remote);

    expect(result).toEqual(remote);
  });

  it('GETs /programs/:slug for a single program', () => {
    const remote = makeProgram({ slug: 'lake-chad' });

    let result: Program | undefined;
    api.get('lake-chad').subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url.endsWith('/programs/lake-chad'));
    expect(req.request.method).toBe('GET');
    req.flush(remote);

    expect(result).toEqual(remote);
  });

  it('URL-encodes the slug', () => {
    api.get('a/b').subscribe();
    httpMock.expectOne((r) => r.url.endsWith('/programs/a%2Fb')).flush(makeProgram());
  });
});
