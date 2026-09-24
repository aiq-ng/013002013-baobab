import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ResourcesApi } from './resources.api';
import { RegistryDocument } from '../models/resource';

describe('ResourcesApi', () => {
  let api: ResourcesApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ResourcesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('GETs /resources relative to the api base url', () => {
    const documents: RegistryDocument[] = [
      {
        id: 'a1b2c3',
        title: 'Annual Statecraft Review',
        batchReference: 'BBG-2026-001',
        languages: 'English, Français',
        fileSizeBytes: 2_400_000,
        downloadUrl: 'https://cdn.example.com/a1b2c3.pdf',
        batchLabel: 'Annual Codex · Vol. IX',
        releaseTag: 'Permanent Archive Release',
        documentDateLabel: 'Annual Statecraft Review (2024–2025)',
        description: 'Desc',
        chapters: ['Ch. I'],
        excerptHeading: 'Excerpt',
        excerptQuote: 'Quote',
        excerptAttribution: 'Attribution',
        onlineUrl: 'https://cdn.example.com/a1b2c3.html',
        metadata: [
          { label: 'Label A', value: 'Value A', accent: true },
          { label: 'Label B', value: 'Value B', accent: false },
          { label: 'Label C', value: 'Value C', accent: false },
          { label: 'Label D', value: 'Value D', accent: true },
        ],
      },
    ];

    let result: RegistryDocument[] | undefined;
    api.list().subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url.endsWith('/resources'));
    expect(req.request.method).toBe('GET');
    req.flush(documents);

    expect(result).toEqual(documents);
  });
});
