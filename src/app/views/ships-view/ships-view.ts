import { Component, effect, inject, viewChild } from '@angular/core';
import { MainLayout } from '../../shared/layouts/main-layout/main-layout';
import { MainHeader } from '../../shared/structure-components/main-header/main-header';
import { MainAside } from '../../shared/structure-components/main-aside/main-aside';
import { ShipStore } from '../../core/ship-management/ship-management.store';
import { ShipsList } from './ships-list/ships-list';
import { StToastComponent } from '@otrocadev/orbital-spacetraders-ds';
import { MainLayoutViewModel } from '../../shared/layouts/main-layout/main-layout.viewmodel';

@Component({
  selector: 'app-ships-view',
  imports: [MainLayout, MainHeader, MainAside, ShipsList, StToastComponent],
  providers: [MainLayoutViewModel],
  templateUrl: './ships-view.html',
  styleUrl: './ships-view.scss',
})
export class ShipsView {
  private readonly _shipsStore = inject(ShipStore);
  private readonly _errorToast = viewChild<StToastComponent>('errorToast');
  private readonly _layoutViewModel = inject(MainLayoutViewModel);

  public readonly title = 'Ships';

  public readonly agentDetails = this._layoutViewModel.agentDetails;
  public readonly agentDetailsError = this._layoutViewModel.agentDetailsError;
  public readonly agentName = this._layoutViewModel.agentName;
  public readonly navItems = this._layoutViewModel.navItems;

  public readonly shipsList = this._shipsStore.shipList;
  public readonly shipError = this._shipsStore.shipError;
  public readonly shipLoading = this._shipsStore.shipLoading;

  constructor() {
    effect(() => {
      if (this.shipError()) {
        this._errorToast()?.show();
      }
    });
  }

  ngOnInit(): void {
    if (!this.shipsList()) {
      this._shipsStore.loadShipList();
    }
  }

  onErrorToastDismissed(): void {
    this._shipsStore.clearShipError();
  }
}
