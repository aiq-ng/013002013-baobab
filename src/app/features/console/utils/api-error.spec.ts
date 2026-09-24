import { HttpErrorResponse } from '@angular/common/http';
import { describeApiError } from './api-error';

const httpError = (status: number): HttpErrorResponse =>
  new HttpErrorResponse({ status, url: 'https://api.example/admin/x' });

describe('describeApiError', () => {
  it('explains a lost connection rather than blaming the input', () => {
    expect(describeApiError(httpError(0), 'Could not save.')).toBe(
      'Could not reach the server. Check your connection and try again.',
    );
  });

  it('explains an expired session', () => {
    expect(describeApiError(httpError(401), 'Could not save.')).toContain('session has expired');
  });

  it('explains a rejected security check (CSRF / forbidden)', () => {
    expect(describeApiError(httpError(403), 'Could not save.')).toContain('permission');
  });

  it('explains a conflicting concurrent edit', () => {
    expect(describeApiError(httpError(409), 'Could not save.')).toContain(
      'changed by someone else',
    );
  });

  it('explains an oversized upload', () => {
    expect(describeApiError(httpError(413), 'Could not save.')).toContain('too large');
  });

  it('explains rate limiting', () => {
    expect(describeApiError(httpError(429), 'Could not save.')).toContain('Too many requests');
  });

  it('explains a server fault without leaking detail', () => {
    expect(describeApiError(httpError(503), 'Could not save.')).toBe(
      'Could not save. The server had a problem — please try again shortly.',
    );
  });

  it('falls back to the caller message for anything else', () => {
    expect(describeApiError(httpError(422), 'Could not save.')).toBe('Could not save.');
    expect(describeApiError(new Error('boom'), 'Could not save.')).toBe('Could not save.');
    expect(describeApiError(null, 'Could not save.')).toBe('Could not save.');
  });
});
