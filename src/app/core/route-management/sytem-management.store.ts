import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, of, shareReplay, tap } from 'rxjs';
import { Item } from '../shared/shared.models';
import { AgentStore } from '../agent-management/agent-management.store';
import {
  ListSystemWaypointsResponse,
  MarketDetailsResponse,
  StoreMarketGoodDetails,
  StoreMarketplaceDetails,
  StoreSystemDetails,
  StoreWaypointDetails,
  TradeGoodType,
} from './route-management';
import { SytemManagementService } from './sytem-management.service';
import { extractSystemSymbolFromWaypoint } from './route-management.utils';

@Injectable()
export class SytemStore {
  private readonly _sytemManagementService = inject(SytemManagementService);
  private readonly _agentStore = inject(AgentStore);

  private readonly _systemsMap = signal<StoreSystemDetails[]>([]);
  private readonly _inFlightMarketplaceRequests = new Map<
    string,
    Observable<StoreMarketplaceDetails>
  >();

  public readonly agentHeadquarters = computed(
    () => this._agentStore.agentDetails()?.headquarters ?? null,
  );
  public readonly systemsMap = this._systemsMap.asReadonly();

  constructor() {
    effect(() => {
      this.loadFirstSystemWaypoints();
    });
  }

  public loadSystemWaypoints(systemSymbol: string): Observable<StoreSystemDetails> {
    const normalizedSystemSymbol = systemSymbol.trim();
    const cachedSystem = this._systemsMap().find((item) => item.symbol === normalizedSystemSymbol);

    // Evitamos cargar de nuevo los datos si ya estan en el store
    if (cachedSystem) {
      return of(cachedSystem);
    }

    return this._sytemManagementService.getSystemWaypoints(normalizedSystemSymbol).pipe(
      map((response: ListSystemWaypointsResponse) => {
        if (!response?.data || !response?.meta) {
          throw new Error('Invalid response format: missing data or meta field');
        }

        const systemDetails: StoreSystemDetails = {
          symbol: normalizedSystemSymbol,
          waypoints: response.data.map(
            (waypoint): StoreWaypointDetails => ({
              symbol: waypoint.symbol,
              type: waypoint.type,
              x: waypoint.x,
              y: waypoint.y,
              jumpGate: waypoint.type === 'JUMP_GATE',
              hasMarketplace: waypoint.traits.some((trait) => trait.symbol === 'MARKETPLACE'),
              marketplace: undefined,
            }),
          ),
        };

        return systemDetails;
      }),
      tap((systemDetails) => {
        this._systemsMap.update((current) =>
          current.some((item) => item.symbol === systemDetails.symbol)
            ? current
            : [...current, systemDetails],
        );
      }),
    );
  }

  public loadFirstSystemWaypoints(): void {
    const agentHeadquarters = this.agentHeadquarters();
    if (!agentHeadquarters) {
      return;
    }

    const systemSymbol = extractSystemSymbolFromWaypoint(agentHeadquarters);
    this.loadSystemWaypoints(systemSymbol).subscribe();
  }

  public loadWaypointMarketplace(
    systemSymbol: string,
    waypointSymbol: string,
  ): Observable<StoreMarketplaceDetails> {
    const normalizedSystemSymbol = systemSymbol.trim();
    const requestKey = `${normalizedSystemSymbol}:${waypointSymbol}`;
    const system = this._systemsMap().find((item) => item.symbol === normalizedSystemSymbol);
    const waypoint = system?.waypoints.find((w) => w.symbol === waypointSymbol);

    if (waypoint?.marketplace) {
      return of(waypoint.marketplace);
    }

    const inFlightRequest = this._inFlightMarketplaceRequests.get(requestKey);

    if (inFlightRequest) {
      return inFlightRequest;
    }

    const request$ = this._sytemManagementService
      .getMarketplaceDetails(normalizedSystemSymbol, waypointSymbol)
      .pipe(
        map((response: MarketDetailsResponse) => {
          const imports = response?.data?.imports ?? [];
          const exports = response?.data?.exports ?? [];
          const exchange = response?.data?.exchange ?? [];

          const mapGoodDetails = (
            name: string,
            symbol: string,
            type: TradeGoodType,
          ): StoreMarketGoodDetails => ({
            symbol: symbol as Item,
            name,
            type,
            tradeVolume: 0,
          });

          const marketplaceDetails = {
            imports: [
              ...imports.map((good) => mapGoodDetails(good.name, good.symbol, 'IMPORT')),
              ...exchange.map((good) => mapGoodDetails(good.name, good.symbol, 'IMPORT')),
            ],
            exports: [
              ...exports.map((good) => mapGoodDetails(good.name, good.symbol, 'EXPORT')),
              ...exchange.map((good) => mapGoodDetails(good.name, good.symbol, 'EXPORT')),
            ],
          } as StoreMarketplaceDetails;

          return marketplaceDetails;
        }),
        tap((marketplaceDetails) => {
          this._systemsMap.update((current) =>
            current.map((sys) =>
              sys.symbol === normalizedSystemSymbol
                ? {
                    ...sys,
                    waypoints: sys.waypoints.map((w) =>
                      w.symbol === waypointSymbol ? { ...w, marketplace: marketplaceDetails } : w,
                    ),
                  }
                : sys,
            ),
          );
        }),
        finalize(() => {
          this._inFlightMarketplaceRequests.delete(requestKey);
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this._inFlightMarketplaceRequests.set(requestKey, request$);

    return request$;
  }
}
