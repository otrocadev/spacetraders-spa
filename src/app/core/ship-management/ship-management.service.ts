import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ShipListAPIResponse } from './ship-management';
import { REQUIRES_AUTH } from '../http/http-context.tokens';

@Injectable()
export class ShipManagementService {
  private readonly _http = inject(HttpClient);

  public getShipsList() {
    let context = new HttpContext().set(REQUIRES_AUTH, true);

    return this._http.get<ShipListAPIResponse>('/v2/my/ships', { context }).pipe(
      map((response) => {
        if (!response?.data) {
          throw new Error('Invalid response format: missing data field');
        }
        return response.data;
      }),
    );
  }
}
