import { Component, input } from '@angular/core';
import { StStatComponent, StSurfaceComponent } from '@otrocadev/orbital-spacetraders-ds';

export interface ShipLoadoutItemMetric {
  label: string;
  value: string | number;
  tone?: 'brand' | 'accent' | 'neutral';
}

@Component({
  selector: 'app-ship-loadout-item',
  imports: [StSurfaceComponent, StStatComponent],
  templateUrl: './ship-loadout-item.html',
  styleUrl: './ship-loadout-item.scss',
})
export class ShipLoadoutItem {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly metrics = input<ShipLoadoutItemMetric[]>([]);
}
