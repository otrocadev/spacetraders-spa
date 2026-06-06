import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteDetails } from '../../../core/route-management/route-management';
import { RouteStore } from '../../../core/route-management/route-management.store';

@Component({
  selector: 'app-route-card',
  standalone: true,
  imports: [],
  templateUrl: './route-card.html',
  styleUrl: './route-card.scss',
})
export class RouteCard {
  private readonly _router = inject(Router);
  private readonly _routeStore = inject(RouteStore);

  route = input.required<RouteDetails>();

  onCardClick(): void {
    this._routeStore.setActiveRoute(this.route().id);
    this._router.navigate(['/routes', this.route().id]);
  }
}
