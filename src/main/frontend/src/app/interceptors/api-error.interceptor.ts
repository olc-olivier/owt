import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Extracts the `error` field from the GlobalExceptionHandler JSON body
 * (`{"error": "..."}`) and re-throws a plain `Error` with that message.
 *
 * This lets components read `err.message` instead of drilling into
 * `HttpErrorResponse.error.error`, and gives a meaningful fallback for
 * network-level failures that have no JSON body.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message =
        err.error?.error ??
        err.error?.message ??
        err.message ??
        'An unexpected error occurred';
      return throwError(() => new Error(message));
    })
  );
