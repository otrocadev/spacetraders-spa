import { Component, input } from '@angular/core';
import { StSurfaceComponent, StProgressComponent } from '@otrocadev/orbital-spacetraders-ds';
import { IconTitleComponent } from '../../../../shared/directives/icon-title/icon-title.directive';
import { TablerIcon } from '../../../../shared/types/tabler-icons';

@Component({
  selector: 'app-ship-component-card',
  imports: [StSurfaceComponent, StProgressComponent, IconTitleComponent],
  templateUrl: './ship-component-card.html',
  styleUrl: './ship-component-card.scss',
})
export class ShipComponentCard {
  readonly icon = input.required<TablerIcon>();
  readonly title = input.required<string>();
  readonly condition = input.required<number>();
  readonly integrity = input.required<number>();
}
