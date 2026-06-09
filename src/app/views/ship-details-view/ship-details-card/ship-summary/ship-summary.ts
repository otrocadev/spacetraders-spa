import { Component, input } from '@angular/core';
import { StSurfaceComponent, StProgressComponent } from '@otrocadev/orbital-spacetraders-ds';
import { BadgeComponent } from '../../../../shared/components/badge/badge';
import { ShipDetails } from '../../../../core/ship-management/ship-management';

@Component({
  selector: 'app-ship-summary',
  imports: [StSurfaceComponent, BadgeComponent, StProgressComponent],
  templateUrl: './ship-summary.html',
  styleUrl: './ship-summary.scss',
})
export class ShipSummary {
  readonly shipDetails = input.required<ShipDetails>();
}
