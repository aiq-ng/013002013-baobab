import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ArchiveApi } from './archive.api';
import { ArchiveEntry } from '../models/resource';

describe('ArchiveApi', () => {
  let api: ArchiveApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ArchiveApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('GETs /archive relative to the api base url', () => {
    const entries: ArchiveEntry[] = [
      {
        id: 'a1b2c3',
        refCode: 'BBG-LQ-2023-TRX',
        regionTag: 'Sahel Central Basin',
        statusTag: 'Ratified: November 2023 · In Active Force',
        title: 'Liptako-Gourma Tri-Border Accord & Customary Grazing Charter',
        description: 'Tripartite non-aggression and dry-season corridor demarcations.',
        ratifyingParties: 'Delegations of Mali, Niger, Burkina Faso',
        workingLanguages: 'Français, Hausa, Fulfulde, Tamasheq',
        category: 'Transhumance',
      },
    ];

    let result: ArchiveEntry[] | undefined;
    api.list().subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url.endsWith('/archive'));
    expect(req.request.method).toBe('GET');
    req.flush(entries);

    expect(result).toEqual(entries);
  });
});
