import { Injectable } from '@angular/core';
import { RouteDetails } from './route-management';

@Injectable({ providedIn: 'root' })
export class RoutePersistenceService {
  private readonly _storageKeyPrefix = 'agent_routes';

  public load(
    agentSymbol: string,
  ): { routes: RouteDetails[]; activeRouteId: string | null } | null {
    try {
      const rawPayload = localStorage.getItem(this.getStorageKey(agentSymbol));

      if (!rawPayload) {
        return null;
      }

      const parsedPayload = JSON.parse(rawPayload);

      if (
        !parsedPayload ||
        !Array.isArray(parsedPayload.routes) ||
        (parsedPayload.activeRouteId !== null && typeof parsedPayload.activeRouteId !== 'string')
      ) {
        return null;
      }

      return {
        routes: parsedPayload.routes,
        activeRouteId: parsedPayload.activeRouteId ?? null,
      };
    } catch {
      return null;
    }
  }

  public save(agentSymbol: string, routes: RouteDetails[], activeRouteId: string | null): void {
    localStorage.setItem(
      this.getStorageKey(agentSymbol),
      JSON.stringify({ routes, activeRouteId }),
    );
  }

  private getStorageKey(agentSymbol: string): string {
    return `${this._storageKeyPrefix}:${agentSymbol}`;
  }
}
