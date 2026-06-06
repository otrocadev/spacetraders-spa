import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsoluteUrl = /^https?:\/\//i.test(req.url);

  if (isAbsoluteUrl) {
    return next(req);
  }

  const baseUrl = environment.API_BASE_URL.replace(/\/+$/, '');
  const requestPath = req.url.startsWith('/') ? req.url : `/${req.url}`;

  return next(
    req.clone({
      url: `${baseUrl}${requestPath}`,
    }),
  );
};
