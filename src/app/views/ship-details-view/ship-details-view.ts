import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShipDetails } from '../../core/ship-management/ship-management';
import { MainLayout } from '../../shared/layouts/main-layout/main-layout';
import { MainHeader } from '../../shared/structure-components/main-header/main-header';
import { MainAside } from '../../shared/structure-components/main-aside/main-aside';
import { MainLayoutViewModel } from '../../shared/layouts/main-layout/main-layout.viewmodel';
import { ShipDetailsCard } from './ship-details-card/ship-details-card';

@Component({
  selector: 'app-ship-details-view',
  imports: [MainLayout, MainHeader, MainAside, ShipDetailsCard],
  providers: [MainLayoutViewModel],
  templateUrl: './ship-details-view.html',
  styleUrl: './ship-details-view.scss',
})
export class ShipDetailsView {
  private readonly _route = inject(ActivatedRoute);
  private readonly _shipFromRoute = this._route.snapshot.data['ship'] as ShipDetails | null;
  private readonly _layoutViewModel = inject(MainLayoutViewModel);

  public readonly agentDetailsError = this._layoutViewModel.agentDetailsError;
  public readonly agentDetails = this._layoutViewModel.agentDetails;
  public readonly agentName = this._layoutViewModel.agentName;
  public readonly navItems = this._layoutViewModel.navItems;

  public readonly ship = computed<ShipDetails | null>(() => {
    return this._shipFromRoute ?? null;
  });
}
