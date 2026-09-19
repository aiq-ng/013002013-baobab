import { inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EngagementService } from './engagement.service';
import { SuccessModalService } from './success-modal.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { EngagementRequest } from '../../../core/models/engagement-request';

interface ValidationDetailItem {
  loc?: unknown;
  msg?: unknown;
}

const GENERIC_ERROR = 'Something went wrong. Please try again.';
const SERVER_ERROR = 'Something went wrong on our end. Please try again shortly.';
const RATE_LIMIT_ERROR = 'Too many requests — please wait a few minutes and try again.';
const TIMEOUT_ERROR = 'The request timed out. Please check your connection and try again.';

export interface EngagementSubmissionController {
  /** Disables the submit button and blocks a second concurrent submit while true. */
  readonly submitting: ReturnType<typeof signal<boolean>>;
  /** A readable message for a 429/5xx/timeout, rendered near the submit button. */
  readonly errorMessage: ReturnType<typeof signal<string | null>>;
  submit(form: FormGroup, request: EngagementRequest): void;
}

/**
 * The one shared submit path every email-capture form on the site goes
 * through: pending state, 422 → form-control errors, 429/5xx/timeout → a
 * readable message, and a success modal that only opens on a confirmed 2xx
 * with a server-issued reference ID. `EngagementApi` already retries once
 * (jittered backoff) on network error/5xx — this layer just surfaces the
 * final outcome.
 *
 * `fieldMap` translates a server validation field name (from the FastAPI
 * `detail[].loc` path) to the form's control name, for forms whose control
 * names don't match the API's `name`/`email`/`message` fields 1:1.
 *
 * The source is read from `request.source` at submit time, not fixed at
 * construction — components whose `source` comes from an `@Input` (e.g. the
 * shared `DispatchForm`) can safely create the controller as a field
 * initializer before that input is bound.
 */
export function createEngagementSubmission(
  options: { fieldMap?: Record<string, string> } = {},
): EngagementSubmissionController {
  const engagementService = inject(EngagementService);
  const successModalService = inject(SuccessModalService);
  const analyticsService = inject(AnalyticsService);
  const fieldMap = options.fieldMap ?? {};

  const submitting = signal(false);
  const errorMessage = signal<string | null>(null);

  // One UUID per form-fill: generated once here (controller is created at
  // component construction) and reused across attempts/retries until a
  // confirmed success, per the idempotency-key contract.
  let idempotencyKey = engagementService.generateIdempotencyKey();

  function applyValidationErrors(form: FormGroup, details: ValidationDetailItem[]): void {
    let mappedAny = false;
    for (const item of details) {
      const loc = Array.isArray(item.loc) ? (item.loc as unknown[]) : [];
      const serverField =
        typeof loc[loc.length - 1] === 'string' ? (loc[loc.length - 1] as string) : null;
      const msg = typeof item.msg === 'string' ? item.msg : 'This field is invalid.';
      const controlName = serverField ? (fieldMap[serverField] ?? serverField) : null;
      const control = controlName ? form.get(controlName) : null;
      if (control) {
        control.setErrors({ ...control.errors, server: msg });
        control.markAsTouched();
        mappedAny = true;
      }
    }
    if (!mappedAny) {
      errorMessage.set('Please check the form and try again.');
    }
  }

  function handleError(error: unknown, form: FormGroup): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 422) {
        const detail = (error.error as { detail?: unknown })?.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          applyValidationErrors(form, detail as ValidationDetailItem[]);
          return;
        }
        errorMessage.set('Please check the form and try again.');
        return;
      }
      if (error.status === 429) {
        errorMessage.set(RATE_LIMIT_ERROR);
        return;
      }
      if (error.status === 0 || error.status >= 500) {
        errorMessage.set(SERVER_ERROR);
        return;
      }
      errorMessage.set(GENERIC_ERROR);
      return;
    }
    if (error instanceof Error && error.name === 'TimeoutError') {
      errorMessage.set(TIMEOUT_ERROR);
      return;
    }
    errorMessage.set(GENERIC_ERROR);
  }

  function submit(form: FormGroup, request: EngagementRequest): void {
    if (submitting()) {
      return;
    }
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    errorMessage.set(null);
    submitting.set(true);

    engagementService.submit(request, idempotencyKey).subscribe({
      next: (response) => {
        submitting.set(false);
        analyticsService.trackFormSubmit(request.source);
        successModalService.show(request.source, response.referenceId);
        form.reset();
        // Regenerated only after confirmed success, so a genuine second
        // enquiry is never swallowed by the server's idempotency check.
        idempotencyKey = engagementService.generateIdempotencyKey();
      },
      error: (error: unknown) => {
        submitting.set(false);
        handleError(error, form);
      },
    });
  }

  return { submitting, errorMessage, submit };
}
