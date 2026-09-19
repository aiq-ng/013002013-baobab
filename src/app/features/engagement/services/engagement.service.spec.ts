import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { EngagementService } from './engagement.service';
import { EngagementRequest } from '../../../core/models/engagement-request';

describe('EngagementService', () => {
  let service: EngagementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EngagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const request: EngagementRequest = {
    source: 'contact-form',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Requesting a dialogue.',
  };

  it('creates', () => {
    expect(service).toBeTruthy();
  });

  it('delegates to the engagement API and resolves the server-issued reference ID', async () => {
    const promise = firstValueFrom(service.submit(request, 'key-1'));

    const req = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
    expect(req.request.headers.get('Idempotency-Key')).toBe('key-1');
    req.flush({ referenceId: 'BB-SERVER-1', submittedAt: '2026-01-01T00:00:00Z' });

    const response = await promise;
    expect(response.referenceId).toBe('BB-SERVER-1');
  });

  it('generates a UUID-shaped idempotency key', () => {
    const key = service.generateIdempotencyKey();
    expect(key).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
