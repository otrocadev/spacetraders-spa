import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouteInventoryItem } from '../../../core/route-management/route-management';

@Component({
  selector: 'app-route-inventory-summary',
  templateUrl: './route-inventory-summary.html',
  styleUrl: './route-inventory-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteInventorySummary {
  public readonly inventory = input<RouteInventoryItem[]>([]);
  public readonly capacity = input<number>(0);

  public readonly totalItems = computed(() =>
    this.inventory().reduce((total, item) => total + item.quantity, 0),
  );

  public readonly overCapacity = computed(() => this.totalItems() > this.capacity());

  public readonly errorMessage = computed(() => {
    if (!this.overCapacity()) {
      return '';
    }

    return `Inventory exceeds capacity by ${this.totalItems() - this.capacity()} items.`;
  });
}
