import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { RouteDetails } from './route-management';
import { AgentStore } from '../agent-management/agent-management.store';
import { extractSystemSymbolFromWaypoint } from './route-management.utils';
import { RoutePersistenceService } from './route-persistence.service';

@Injectable()
export class RouteStore {
  private readonly _agentStore = inject(AgentStore);
  private readonly _routePersistenceService = inject(RoutePersistenceService);

  private readonly _agentRoutes = signal<RouteDetails[]>([]);
  private readonly _activeRouteId = signal<string | null>(null); // this will be getted from the resolver
  private readonly _hydratedAgentSymbol = signal<string | null>(null);

  public readonly agentDetails = this._agentStore.agentDetails;
  public readonly agentHeadquarters = computed(() => this.agentDetails()?.headquarters);
  public readonly agentRoutes = this._agentRoutes.asReadonly();
  public readonly activeRouteId = this._activeRouteId.asReadonly();
  public readonly activeRoute = computed(() => {
    const id = this._activeRouteId();
    if (!id) {
      return null;
    }

    return this._agentRoutes().find((route) => route.id === id) ?? null;
  });
  public readonly activeRouteVirtualInventory = computed(() => {
    const route = this.activeRoute();

    if (!route) {
      return [];
    }

    return this.calculateVirtualInventory(route);
  });

  constructor() {
    effect(() => {
      const agentSymbol = this.agentDetails()?.symbol;

      if (!agentSymbol || this._hydratedAgentSymbol() === agentSymbol) {
        return;
      }
      // Cargamos las rutas
      const persisted = this._routePersistenceService.load(agentSymbol);
      // Las metemos en el store
      const hydratedRoutes = (persisted?.routes ?? []).map((route) => ({
        ...route,
        virtualInventory: this.calculateVirtualInventory(route),
      }));
      const hasPersistedActiveRoute = hydratedRoutes.some(
        (route) => route.id === persisted?.activeRouteId,
      );

      this._agentRoutes.set(hydratedRoutes);
      this._activeRouteId.set(hasPersistedActiveRoute ? (persisted?.activeRouteId ?? null) : null);
      this._hydratedAgentSymbol.set(agentSymbol);
    });

    effect(() => {
      const agentSymbol = this.agentDetails()?.symbol;

      if (!agentSymbol || this._hydratedAgentSymbol() !== agentSymbol) {
        return;
      }

      this._routePersistenceService.save(agentSymbol, this._agentRoutes(), this._activeRouteId());
    });
  }

  public createNewRoute(routeName: string): void {
    const agentHeadquartersWaypoint = this.agentHeadquarters();
    if (!agentHeadquartersWaypoint) {
      throw new Error('Agent headquarters not loaded. Cannot create route without it.');
    }
    const agentHeadquartersSystem = extractSystemSymbolFromWaypoint(agentHeadquartersWaypoint);
    const newRoute: RouteDetails = {
      id: crypto.randomUUID(), // randomUUID para poder traquear mejor las rutas
      name: routeName,
      virtualInvertoryCapacity: 80, //Como no selecionamos naves pora hora, dejamos un valor por defecto
      virtualInventory: [],
      steps: [
        {
          index: 0,
          origin: {
            systemSymbol: agentHeadquartersSystem,
            waypointSymbol: agentHeadquartersWaypoint,
          },
          destination: {
            systemSymbol: '',
            waypointSymbol: '',
          },
        },
      ],
    };
    this._agentRoutes.update((routes) => [...routes, newRoute]);
    this._activeRouteId.set(newRoute.id);
  }

  public updateActiveRoute(route: RouteDetails): void {
    const activeRouteId = this._activeRouteId();

    if (!activeRouteId) {
      return;
    }

    const { virtualInventory: _ignoredVirtualInventory, ...routePayload } = route;

    const routeWithVirtualInventory: RouteDetails = {
      ...routePayload,
      virtualInventory: this.calculateVirtualInventory(route),
    };

    this._agentRoutes.update((routes) =>
      routes.map((existingRoute) =>
        existingRoute.id === activeRouteId
          ? { ...existingRoute, ...routeWithVirtualInventory, id: activeRouteId }
          : existingRoute,
      ),
    );

    console.log('Route saved in store:', routeWithVirtualInventory);
  }

  public setActiveRoute(routeId: string): void {
    this._activeRouteId.set(routeId);
  }

  public clearActiveRoute(): void {
    this._activeRouteId.set(null);
  }

  private calculateVirtualInventory(route: RouteDetails): RouteDetails['virtualInventory'] {
    const inventoryBySymbol = new Map<RouteDetails['virtualInventory'][number]['symbol'], number>();

    for (const step of route.steps) {
      for (const action of step.comercialActions ?? []) {
        const currentQuantity = inventoryBySymbol.get(action.item) ?? 0;
        const quantityDelta = action.type === 'BUY' ? action.quantity : -action.quantity;
        const nextQuantity = Math.max(0, currentQuantity + quantityDelta);

        if (nextQuantity === 0) {
          inventoryBySymbol.delete(action.item);
          continue;
        }

        inventoryBySymbol.set(action.item, nextQuantity);
      }
    }

    return Array.from(inventoryBySymbol.entries()).map(([symbol, quantity]) => ({
      symbol,
      name: symbol,
      quantity,
    }));
  }
}
