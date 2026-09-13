import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { EngagementService } from './engagement.service';
import { EngagementRequest } from '../../../core/models/engagement-request';

describe('EngagementService', () => {
  let service: EngagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EngagementService);
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

  it('resolves with a reference ID and submission timestamp', async () => {
    const response = await firstValueFrom(service.submit(request));
    expect(response.referenceId).toMatch(/^[A-Za-z0-9-]+$/);
    expect(new Date(response.submittedAt).toString()).not.toBe('Invalid Date');
  });

  it('returns a different reference ID for each submission', async () => {
    const first = await firstValueFrom(service.submit(request));
    const second = await firstValueFrom(service.submit(request));
    expect(first.referenceId).not.toBe(second.referenceId);
  });
});
