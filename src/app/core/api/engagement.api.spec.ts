import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EngagementApi } from './engagement.api';
import { EngagementRequest } from '../models/engagement-request';

describe('EngagementApi', () => {
  let api: EngagementApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(EngagementApi);
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

  it('POSTs to /engagements relative to the api base url with an Idempotency-Key header', () => {
    let result: unknown;
    api.submit(request, 'key-123').subscribe((res) => (result = res));

    const req = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Idempotency-Key')).toBe('key-123');
    expect(req.request.body).toEqual(request);

    req.flush({ referenceId: 'BB-1', submittedAt: '2026-01-01T00:00:00Z' });

    expect(result).toEqual({ referenceId: 'BB-1', submittedAt: '2026-01-01T00:00:00Z' });
  });

  it('rejects immediately on a 422 without retrying', () => {
    let error: unknown;
    api.submit(request, 'key-123').subscribe({ error: (err) => (error = err) });

    const req = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
    req.flush(
      { detail: [{ loc: ['body', 'email'], msg: 'value is not a valid email address' }] },
      { status: 422, statusText: 'Unprocessable Entity' },
    );

    httpMock.verify();
    expect((error as { status: number }).status).toBe(422);
  });

  it('retries once with backoff on a 500, then succeeds', async () => {
    vi.useFakeTimers();
    try {
      let result: unknown;
      api.submit(request, 'key-123').subscribe((res) => (result = res));

      const first = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
      first.flush('boom', { status: 500, statusText: 'Server Error' });

      await vi.advanceTimersByTimeAsync(2000);

      const second = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
      second.flush({ referenceId: 'BB-2', submittedAt: '2026-01-01T00:00:00Z' });

      expect(result).toEqual({ referenceId: 'BB-2', submittedAt: '2026-01-01T00:00:00Z' });
    } finally {
      vi.useRealTimers();
    }
  });

  it('gives up after the single retry on repeated 500s', async () => {
    vi.useFakeTimers();
    try {
      let error: unknown;
      api.submit(request, 'key-123').subscribe({ error: (err) => (error = err) });

      const first = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
      first.flush('boom', { status: 500, statusText: 'Server Error' });

      await vi.advanceTimersByTimeAsync(2000);

      const second = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
      second.flush('boom again', { status: 500, statusText: 'Server Error' });

      expect((error as { status: number }).status).toBe(500);
    } finally {
      vi.useRealTimers();
    }
  });

  it('retries once on a network error (status 0)', async () => {
    vi.useFakeTimers();
    try {
      let result: unknown;
      api.submit(request, 'key-123').subscribe((res) => (result = res));

      const first = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
      first.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

      await vi.advanceTimersByTimeAsync(2000);

      const second = httpMock.expectOne((r) => r.url.endsWith('/engagements'));
      second.flush({ referenceId: 'BB-3', submittedAt: '2026-01-01T00:00:00Z' });

      expect(result).toEqual({ referenceId: 'BB-3', submittedAt: '2026-01-01T00:00:00Z' });
    } finally {
      vi.useRealTimers();
    }
  });

  describe('generateIdempotencyKey', () => {
    it('returns a different UUID-shaped value each call', () => {
      const a = api.generateIdempotencyKey();
      const b = api.generateIdempotencyKey();
      expect(a).not.toBe(b);
      expect(a).toMatch(/^[0-9a-f-]{36}$/i);
    });
  });
});
