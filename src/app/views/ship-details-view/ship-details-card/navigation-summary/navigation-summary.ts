import { Component, input } from '@angular/core';
import { IconTitleComponent } from '../../../../shared/directives/icon-title/icon-title.directive';
import { StSurfaceComponent } from '@otrocadev/orbital-spacetraders-ds';
import { BadgeComponent } from '../../../../shared/components/badge/badge';
import { ITablerIcon } from 'ngx-tabler-icons';
import { ShipFlightmode, ShipStatus } from '../../../../core/ship-management/ship-management';

interface NavigationDetails {
  systemSymbol: string;
  waypointSymbol: string;
  status: ShipStatus;
  flightMode: ShipFlightmode;
}

@Component({
  selector: 'app-navigation-summary',
  imports: [IconTitleComponent, StSurfaceComponent, BadgeComponent, ITablerIcon],
  templateUrl: './navigation-summary.html',
  styleUrl: './navigation-summary.scss',
})
export class NavigationSummary {
  readonly navigationDetails = input.required<NavigationDetails>();
}
