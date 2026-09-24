import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface IdleTimerConfig {
  /** Total inactivity before `timedOut` fires. */
  idleMs: number;
  /** How long before the timeout the warning (and countdown) starts. */
  warningMs: number;
}

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

/**
 * Client-side inactivity timeout for the console (OWASP session management:
 * an unattended signed-in admin screen is an open door). The server's cookie
 * TTL remains the real authority; this only shortens the window on a shared
 * or walked-away-from machine. The warning phase satisfies WCAG 2.2.1 —
 * editors are told and can extend before anything happens.
 */
@Injectable({ providedIn: 'root' })
export class IdleTimer {
  private readonly _warning = signal(false);
  private readonly _secondsLeft = signal(0);
  readonly warning = this._warning.asReadonly();
  readonly secondsLeft = this._secondsLeft.asReadonly();
  readonly timedOut = new Subject<void>();

  private config: IdleTimerConfig | null = null;
  private warnHandle: ReturnType<typeof setTimeout> | null = null;
  private expireHandle: ReturnType<typeof setTimeout> | null = null;
  private tickHandle: ReturnType<typeof setInterval> | null = null;
  private deadline = 0;
  private readonly onActivity = (): void => {
    if (!this._warning()) this.schedule();
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  start(config: IdleTimerConfig): void {
    if (typeof document === 'undefined') return;
    this.stop();
    this.config = config;
    for (const type of ACTIVITY_EVENTS) {
      document.addEventListener(type, this.onActivity, { passive: true, capture: true });
    }
    this.schedule();
  }

  stop(): void {
    this.clearTimers();
    this._warning.set(false);
    if (this.config && typeof document !== 'undefined') {
      for (const type of ACTIVITY_EVENTS) {
        document.removeEventListener(type, this.onActivity, { capture: true });
      }
    }
    this.config = null;
  }

  keepAlive(): void {
    if (this.config) this.schedule();
  }

  private schedule(): void {
    const config = this.config;
    if (!config) return;
    this.clearTimers();
    this._warning.set(false);
    this.deadline = Date.now() + config.idleMs;
    this.warnHandle = setTimeout(() => this.beginWarning(), config.idleMs - config.warningMs);
    this.expireHandle = setTimeout(() => this.expire(), config.idleMs);
  }

  private beginWarning(): void {
    this._warning.set(true);
    this.updateSecondsLeft();
    this.tickHandle = setInterval(() => this.updateSecondsLeft(), 1_000);
  }

  private updateSecondsLeft(): void {
    this._secondsLeft.set(Math.max(0, Math.round((this.deadline - Date.now()) / 1_000)));
  }

  private expire(): void {
    this.clearTimers();
    this._warning.set(false);
    this.timedOut.next();
  }

  private clearTimers(): void {
    if (this.warnHandle) clearTimeout(this.warnHandle);
    if (this.expireHandle) clearTimeout(this.expireHandle);
    if (this.tickHandle) clearInterval(this.tickHandle);
    this.warnHandle = this.expireHandle = this.tickHandle = null;
  }
}
