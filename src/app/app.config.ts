import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideIcons } from 'ngx-tabler-icons';
import {
  IconBarcode,
  IconCurrencyDollar,
  IconCurrentLocation,
  IconGridScan,
  IconObjectScan,
  IconRocket,
  IconRoute,
  IconScan,
  IconSparkles,
  IconUniverse,
  IconUsers,
} from 'ngx-tabler-icons/icons';
import { apiBaseUrlInterceptor } from './core/http/interceptors/api-base-url.interceptor';
import { authInterceptor } from './core/http/interceptors/auth.interceptor';
import { timeoutInterceptor } from './core/http/interceptors/timeout.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([apiBaseUrlInterceptor, authInterceptor, timeoutInterceptor]),
    ),
    provideRouter(routes),
    provideIcons({
      IconBarcode,
      IconCurrentLocation,
      IconCurrencyDollar,
      IconGridScan,
      IconObjectScan,
      IconRocket,
      IconRoute,
      IconScan,
      IconSparkles,
      IconUniverse,
      IconUsers,
    }),
  ],
};
