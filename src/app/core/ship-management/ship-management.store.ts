import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { ShipManagementService } from './ship-management.service';
import { ShipDetails } from './ship-management';

@Injectable()
export class ShipStore {
  private readonly _shipManagementService = inject(ShipManagementService);
  private readonly _shipList = signal<ShipDetails[] | null>(null);
  private readonly _shipError = signal<string | null>(null);
  private readonly _selectedShip = signal<ShipDetails | null>(null);
  private readonly _shipLoading = signal(false);

  public readonly shipList = this._shipList.asReadonly();
  public readonly shipError = this._shipError.asReadonly();
  public readonly selectedShip = this._selectedShip.asReadonly();
  public readonly shipLoading = this._shipLoading.asReadonly();

  public setShipError(message: string): void {
    this._shipError.set(message);
  }

  public clearShipError(): void {
    this._shipError.set(null);
  }

  public selectShip(ship: ShipDetails): void {
    this.clearShipError();
    this._selectedShip.set(ship);
  }

  public clearSelectedShip(): void {
    this._selectedShip.set(null);
  }

  public setShipList(ships: ShipDetails[]): void {
    this._shipList.set(ships);
  }

  public getShipBySymbol(symbol: string): ShipDetails | null {
    const selectedShip = this._selectedShip();
    if (selectedShip?.symbol === symbol) {
      return selectedShip;
    }

    const cachedShip = this._shipList()?.find((ship) => ship.symbol === symbol);
    if (cachedShip) {
      this._selectedShip.set(cachedShip);
      return cachedShip;
    }

    return null;
  }

  public loadShipList(): void {
    this._shipLoading.set(true);
    this._shipManagementService
      .getShipsList()
      .pipe(
        tap((ships) => this.setShipList(ships)),
        catchError((err) => {
          if (err?.name === 'TimeoutError') {
            this._shipError.set('Ship details request timed out');
            return of(null);
          }
          this._shipError.set(err?.message ?? 'Failed to load ship details');
          return of(null);
        }),
        finalize(() => this._shipLoading.set(false)),
      )
      .subscribe();
  }
}
