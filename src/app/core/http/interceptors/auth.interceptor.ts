import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { SessionStore } from '../../session-management/session-management.store';
import { AUTH_TOKEN_OVERRIDE, REQUIRES_AUTH } from '../http-context.tokens';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(REQUIRES_AUTH)) {
    return next(req);
  }

  const sessionStore = inject(SessionStore);
  const overrideToken = req.context.get(AUTH_TOKEN_OVERRIDE)?.trim();
  const sessionToken = sessionStore.token();
  const token = overrideToken || sessionToken;

  if (!token) {
    return throwError(() => new Error('Missing auth token'));
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
