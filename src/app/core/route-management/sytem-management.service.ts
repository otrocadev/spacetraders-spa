import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ListSystemWaypointsResponse, MarketDetailsResponse } from './route-management';

@Injectable()
export class SytemManagementService {
  private readonly _http = inject(HttpClient);

  public getSystemWaypoints(systemSymbol: string): Observable<ListSystemWaypointsResponse> {
    return this._http.get<ListSystemWaypointsResponse>(`/v2/systems/${systemSymbol}/waypoints`);
  }

  public getMarketplaceDetails(
    systemSymbol: string,
    waypointSymbol: string,
  ): Observable<MarketDetailsResponse> {
    return this._http
      .get<MarketDetailsResponse>(`/v2/systems/${systemSymbol}/waypoints/${waypointSymbol}/market`)
      .pipe(
        map((response) => {
          if (!response?.data) {
            throw new Error('Invalid response format: missing data field');
          }
          return response;
        }),
      );
  }
}
