import { Component, input } from '@angular/core';
import { RouteDetails } from '../../../core/route-management/route-management';
import { RouteCard } from '../route-card/route-card';

@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [RouteCard],
  templateUrl: './routes-list.html',
  styleUrl: './routes-list.scss',
})
export class RoutesList {
  routesList = input.required<RouteDetails[]>();
}
