import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../session-management.store';

export const LoggedInGuard: CanActivateFn = () => {
  const sessionStore = inject(SessionStore);
  const router = inject(Router);

  if (sessionStore.token()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
