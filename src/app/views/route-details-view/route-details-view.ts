import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainLayout } from '../../shared/layouts/main-layout/main-layout';
import { MainHeader } from '../../shared/structure-components/main-header/main-header';
import { MainAside } from '../../shared/structure-components/main-aside/main-aside';
import { MainLayoutViewModel } from '../../shared/layouts/main-layout/main-layout.viewmodel';
import { RouteForm } from './route-form/route-form';
import { RouteDetailsSummary } from './route-details-summary/route-details-summary';
import { SytemStore } from '../../core/route-management/sytem-management.store';
import { RouteStore } from '../../core/route-management/route-management.store';
import { AgentStore } from '../../core/agent-management/agent-management.store';
import { RouteDetails } from '../../core/route-management/route-management';

@Component({
  selector: 'app-route-details-view',
  imports: [MainLayout, MainHeader, MainAside, RouteForm, RouteDetailsSummary],
  providers: [MainLayoutViewModel],
  templateUrl: './route-details-view.html',
  styleUrl: './route-details-view.scss',
})
export class RouteDetailsView {
  private readonly _layoutViewModel = inject(MainLayoutViewModel);
  private readonly _route = inject(ActivatedRoute);
  private readonly _systemStore = inject(SytemStore);
  private readonly _routeStore = inject(RouteStore);
  private readonly _agentStore = inject(AgentStore);

  public readonly agentDetailsError = this._layoutViewModel.agentDetailsError;
  public readonly agentDetails = this._layoutViewModel.agentDetails;
  public readonly agentName = this._layoutViewModel.agentName;
  public readonly navItems = this._layoutViewModel.navItems;
  public readonly currentRoute = this._routeStore.activeRoute;
  public readonly mode = signal<'details' | 'edit'>('details');
  public readonly title = computed(() => this.currentRoute()?.name ?? 'Route details');
  public readonly agentHQ = computed(() => this._agentStore.agentDetails()?.headquarters ?? '');
  public readonly systemsMap = this._systemStore.systemsMap;

  ngOnInit(): void {
    if (this._route.snapshot.routeConfig?.path === 'new') {
      this.mode.set('edit');
      this._routeStore.clearActiveRoute();
    }
  }

  public enterEditMode(): void {
    this.mode.set('edit');
  }

  public enterDetailsMode(): void {
    this.mode.set('details');
  }

  public onStartRoute(name: string): void {
    this._routeStore.createNewRoute(name);
  }

  public onUpdateRoute(route: RouteDetails): void {
    this._routeStore.updateActiveRoute(route);
  }
}
