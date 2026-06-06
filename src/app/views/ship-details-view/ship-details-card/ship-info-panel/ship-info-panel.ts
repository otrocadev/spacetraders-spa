import { Component, input } from '@angular/core';
import { StStatComponent, StSurfaceComponent } from '@otrocadev/orbital-spacetraders-ds';

export interface ShipInfoPanelMetric {
  label: string;
  value: string | number;
  tone?: 'brand' | 'accent' | 'neutral';
}

@Component({
  selector: 'app-ship-info-panel',
  imports: [StSurfaceComponent, StStatComponent],
  templateUrl: './ship-info-panel.html',
  styleUrl: './ship-info-panel.scss',
})
export class ShipInfoPanel {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input('');
  readonly metrics = input<ShipInfoPanelMetric[]>([]);
}
