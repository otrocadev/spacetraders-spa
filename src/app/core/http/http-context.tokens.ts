import { HttpContextToken } from '@angular/common/http';

export const REQUIRES_AUTH = new HttpContextToken<boolean>(() => false);
export const REQUEST_TIMEOUT_MS = new HttpContextToken<number>(() => 5000);
export const AUTH_TOKEN_OVERRIDE = new HttpContextToken<string | null>(() => null);
