import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { StButtonComponent } from '@otrocadev/orbital-spacetraders-ds';
import { RouteDetails } from '../../../core/route-management/route-management';
import { RouteInventorySummary } from '../route-inventory-summary/route-inventory-summary';

@Component({
  selector: 'app-route-details-summary',
  imports: [RouteInventorySummary, StButtonComponent],
  templateUrl: './route-details-summary.html',
  styleUrl: './route-details-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDetailsSummary {
  public readonly route = input.required<RouteDetails>();
  public readonly editRequested = output<void>();

  public onEditRequested(): void {
    this.editRequested.emit();
  }
}
