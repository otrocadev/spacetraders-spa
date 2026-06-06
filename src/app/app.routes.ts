import { Routes } from '@angular/router';
import { LoggedOutGuard } from './core/session-management/guards/logged-out.guard';
import { LoggedInGuard } from './core/session-management/guards/logged-in.guard';
import { ShipManagementService } from './core/ship-management/ship-management.service';
import { shipDetailsResolver } from './core/ship-management/ship-details.resolver';
import { ShipStore } from './core/ship-management/ship-management.store';
import { SytemStore } from './core/route-management/sytem-management.store';
import { SytemManagementService } from './core/route-management/sytem-management.service';
import { RouteStore } from './core/route-management/route-management.store';

export const routes: Routes = [
  {
    path: 'ships',
    canActivate: [LoggedInGuard],
    providers: [ShipManagementService, ShipStore],
    children: [
      {
        path: '',
        loadComponent: () => import('./views/ships-view/ships-view').then((m) => m.ShipsView),
      },
      {
        path: ':symbol',
        resolve: { ship: shipDetailsResolver },
        loadComponent: () =>
          import('./views/ship-details-view/ship-details-view').then((m) => m.ShipDetailsView),
      },
    ],
  },
  {
    path: 'routes',
    canActivate: [LoggedInGuard],
    providers: [SytemStore, SytemManagementService, RouteStore],
    children: [
      {
        path: '',
        loadComponent: () => import('./views/routes-view/routes-view').then((m) => m.RoutesView),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./views/route-details-view/route-details-view').then((m) => m.RouteDetailsView),
      },
      {
        path: ':routeId',
        loadComponent: () =>
          import('./views/route-details-view/route-details-view').then((m) => m.RouteDetailsView),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [LoggedOutGuard],
    loadComponent: () => import('./views/login-view/login-view').then((m) => m.LoginView),
  },
  {
    path: '**',
    redirectTo: 'ships',
  },
];
