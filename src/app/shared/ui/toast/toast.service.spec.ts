import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(ToastService);
  });

  afterEach(() => vi.useRealTimers());

  it('auto-dismisses a success toast', () => {
    service.success('Saved.');
    vi.advanceTimersByTime(6_000);
    expect(service.toasts()).toEqual([]);
  });

  it('keeps an error toast until it is dismissed, so it is never missed (WCAG 2.2.1)', () => {
    service.error('Failed.');
    vi.advanceTimersByTime(60_000);
    expect(service.toasts().map((t) => t.message)).toEqual(['Failed.']);
  });

  it('collapses an identical message instead of stacking duplicates', () => {
    service.error('Failed.');
    service.error('Failed.');
    expect(service.toasts().length).toBe(1);
  });
});
