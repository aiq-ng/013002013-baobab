import { HttpErrorResponse } from '@angular/common/http';

/**
 * Turns a failed admin API call into a message an editor can act on. A 0
 * (network), 401, 429 or 5xx is never the editor's input at fault, so those
 * get their own explanation instead of the caller's "Could not save…" —
 * and no server detail is ever echoed back into the UI.
 */
export function describeApiError(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }
  switch (error.status) {
    case 0:
      return 'Could not reach the server. Check your connection and try again.';
    case 401:
      return 'Your session has expired. Sign in again to continue.';
    case 403:
      return 'You do not have permission to do that, or the security check failed. Reload the page and try again.';
    case 409:
      return 'This record was changed by someone else. Reload to see the latest version.';
    case 413:
      return 'That file is too large for the server to accept.';
    case 429:
      return 'Too many requests. Wait a minute, then try again.';
  }
  if (error.status >= 500) {
    return `${fallback} The server had a problem — please try again shortly.`;
  }
  return fallback;
}
