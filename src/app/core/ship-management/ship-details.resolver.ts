import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { ShipDetails } from './ship-management';
import { ShipManagementService } from './ship-management.service';
import { ShipStore } from './ship-management.store';

export const shipDetailsResolver: ResolveFn<ShipDetails | RedirectCommand> = (route) => {
  const shipStore = inject(ShipStore);
  const shipManagementService = inject(ShipManagementService);
  const router = inject(Router);
  const symbol = route.paramMap.get('symbol');
  const redirectToShips = new RedirectCommand(router.parseUrl('/ships'));

  if (!symbol) {
    shipStore.setShipError('Invalid ship details route. Please choose a ship from the list.');
    return redirectToShips;
  }

  const ship = shipStore.getShipBySymbol(symbol);

  if (ship) {
    return ship;
  }

  return shipManagementService.getShipsList().pipe(
    tap((ships) => shipStore.setShipList(ships)),
    map((ships) => {
      const resolvedShip = ships.find((item) => item.symbol === symbol);

      if (!resolvedShip) {
        shipStore.setShipError('Ship details are unavailable. Please select a ship from the list.');
        return redirectToShips;
      }

      shipStore.selectShip(resolvedShip);
      return resolvedShip;
    }),
    catchError((err: unknown) => {
      if (err && typeof err === 'object' && 'name' in err && err.name === 'TimeoutError') {
        shipStore.setShipError('Ship details request timed out');
      } else {
        shipStore.setShipError('Failed to load ship details');
      }

      return of(redirectToShips);
    }),
  );
};
