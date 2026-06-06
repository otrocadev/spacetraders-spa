import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly tokenStorageKey = 'agent_token';
  private readonly _token = signal<string | null>(null);

  public readonly token = this._token.asReadonly();

  public restoreTokenFromSessionStorage(): boolean {
    const storedToken = sessionStorage.getItem(this.tokenStorageKey);
    this._token.set(storedToken);
    return !!storedToken;
  }

  public setToken(token: string): void {
    const normalizedToken = token.trim();
    this._token.set(normalizedToken);
    sessionStorage.setItem(this.tokenStorageKey, normalizedToken);
  }

  public clearToken(): void {
    this._token.set(null);
    sessionStorage.removeItem(this.tokenStorageKey);
  }
}
