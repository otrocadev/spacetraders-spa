import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs';
import { REQUEST_TIMEOUT_MS } from '../http-context.tokens';

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const timeoutMs = req.context.get(REQUEST_TIMEOUT_MS);

  if (!timeoutMs || timeoutMs <= 0) {
    return next(req);
  }

  return next(req).pipe(timeout(timeoutMs));
};
