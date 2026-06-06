import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ShipCard } from '../ship-card/ship-card';
import { ShipDetails } from '../../../core/ship-management/ship-management';
import { ShipStore } from '../../../core/ship-management/ship-management.store';

@Component({
  selector: 'app-ships-list',
  imports: [ShipCard],
  templateUrl: './ships-list.html',
  styleUrl: './ships-list.scss',
})
export class ShipsList {
  private readonly _shipStore = inject(ShipStore);
  private readonly _router = inject(Router);

  shipsList = input.required<ShipDetails[]>();

  onShipCardClick(ship: ShipDetails): void {
    this._shipStore.selectShip(ship);
    this._router.navigate(['/ships', ship.symbol]);
  }
}
