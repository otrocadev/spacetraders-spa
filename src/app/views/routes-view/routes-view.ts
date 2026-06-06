import { Component, inject } from '@angular/core';
import { MainLayout } from '../../shared/layouts/main-layout/main-layout';
import { MainHeader } from '../../shared/structure-components/main-header/main-header';
import { MainAside } from '../../shared/structure-components/main-aside/main-aside';
import { MainLayoutViewModel } from '../../shared/layouts/main-layout/main-layout.viewmodel';
import { RouteStore } from '../../core/route-management/route-management.store';
import { RoutesList } from './routes-list/routes-list';
import { Router } from '@angular/router';
import { StButtonComponent } from '@otrocadev/orbital-spacetraders-ds';

@Component({
  selector: 'app-routes-view',
  standalone: true,
  imports: [MainLayout, MainHeader, MainAside, RoutesList, StButtonComponent],
  providers: [MainLayoutViewModel],
  templateUrl: './routes-view.html',
  styleUrl: './routes-view.scss',
})
export class RoutesView {
  private readonly _routeStore = inject(RouteStore);
  private readonly _layoutViewModel = inject(MainLayoutViewModel);
  private readonly _router = inject(Router);

  public readonly title = 'Routes';

  public readonly agentDetails = this._layoutViewModel.agentDetails;
  public readonly agentDetailsError = this._layoutViewModel.agentDetailsError;
  public readonly agentName = this._layoutViewModel.agentName;
  public readonly navItems = this._layoutViewModel.navItems;

  public readonly routesList = this._routeStore.agentRoutes;

  onCreateRoute(): void {
    this._router.navigate(['/routes/new']);
  }
}
