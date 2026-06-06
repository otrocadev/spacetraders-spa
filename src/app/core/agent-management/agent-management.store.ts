import { Injectable, signal, inject } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { AgentManagementService } from './agent-management.service';
import { AgentDetails } from './agent-management';

@Injectable({ providedIn: 'root' })
export class AgentStore {
  private readonly _agentManagementService = inject(AgentManagementService);
  private readonly _agentDetails = signal<AgentDetails | null>(null);
  private readonly _agentDetailsError = signal<string | null>(null);

  public readonly agentDetails = this._agentDetails.asReadonly();
  public readonly agentDetailsError = this._agentDetailsError.asReadonly();

  public loadAgentDetails(token?: string): Observable<AgentDetails | null> {
    this._agentDetailsError.set(null);
    return this._agentManagementService.getAgentDetails(token).pipe(
      tap((details) => this._agentDetails.set(details)),
      catchError((err) => {
        if (err?.name === 'TimeoutError') {
          this._agentDetailsError.set('Agent details request timed out');
          return of(null);
        }
        this._agentDetailsError.set(err?.message ?? 'Failed to load agent details');
        return of(null);
      }),
    );
  }

  public clearAgentSession(): void {
    this._agentDetails.set(null);
    this._agentDetailsError.set(null);
  }
}
