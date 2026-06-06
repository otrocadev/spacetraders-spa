import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AgentDetails, AgentDetailsAPIResponse } from './agent-management';
import { AUTH_TOKEN_OVERRIDE, REQUIRES_AUTH } from '../../core/http/http-context.tokens';

@Injectable({
  providedIn: 'root',
})
export class AgentManagementService {
  private readonly _http = inject(HttpClient);

  public getAgentDetails(token?: string): Observable<AgentDetails> {
    let context = new HttpContext().set(REQUIRES_AUTH, true);

    const normalizedToken = token?.trim();
    if (normalizedToken) {
      context = context.set(AUTH_TOKEN_OVERRIDE, normalizedToken);
    }

    return this._http.get<AgentDetailsAPIResponse>('/v2/my/agent', { context }).pipe(
      map((response) => {
        if (!response?.data) {
          throw new Error('Invalid response format: missing data field');
        }
        return response.data;
      }),
    );
  }
}
