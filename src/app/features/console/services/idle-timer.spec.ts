import { TestBed } from '@angular/core/testing';
import { IdleTimer } from './idle-timer';

describe('IdleTimer', () => {
  let timer: IdleTimer;
  let timedOut: ReturnType<typeof vi.fn<() => void>>;
  const IDLE_MS = 10 * 60_000;
  const WARN_MS = 60_000;

  beforeEach(() => {
    vi.useFakeTimers();
    timer = TestBed.inject(IdleTimer);
    timedOut = vi.fn<() => void>();
    timer.timedOut.subscribe(() => timedOut());
    timer.start({ idleMs: IDLE_MS, warningMs: WARN_MS });
  });

  afterEach(() => {
    timer.stop();
    vi.useRealTimers();
  });

  it('warns before signing out, with a live countdown', () => {
    vi.advanceTimersByTime(IDLE_MS - WARN_MS);
    expect(timer.warning()).toBe(true);
    expect(timer.secondsLeft()).toBe(60);

    vi.advanceTimersByTime(10_000);
    expect(timer.secondsLeft()).toBe(50);
    expect(timedOut).not.toHaveBeenCalled();
  });

  it('times out after the full idle period', () => {
    vi.advanceTimersByTime(IDLE_MS);
    expect(timedOut).toHaveBeenCalledTimes(1);
    expect(timer.warning()).toBe(false);
  });

  it('treats user activity as presence and restarts the clock', () => {
    vi.advanceTimersByTime(IDLE_MS - WARN_MS - 1_000);
    document.dispatchEvent(new KeyboardEvent('keydown'));
    vi.advanceTimersByTime(IDLE_MS - WARN_MS - 1_000);

    expect(timer.warning()).toBe(false);
    expect(timedOut).not.toHaveBeenCalled();
  });

  it('ignores passive activity once the warning is showing — staying needs an explicit choice', () => {
    vi.advanceTimersByTime(IDLE_MS - WARN_MS);
    document.dispatchEvent(new KeyboardEvent('keydown'));
    vi.advanceTimersByTime(WARN_MS);

    expect(timedOut).toHaveBeenCalledTimes(1);
  });

  it('keepAlive dismisses the warning and restarts the clock', () => {
    vi.advanceTimersByTime(IDLE_MS - WARN_MS);
    timer.keepAlive();

    expect(timer.warning()).toBe(false);
    vi.advanceTimersByTime(IDLE_MS - 1);
    expect(timedOut).not.toHaveBeenCalled();
  });

  it('stop cancels everything', () => {
    timer.stop();
    vi.advanceTimersByTime(IDLE_MS * 2);
    expect(timedOut).not.toHaveBeenCalled();
  });
});
