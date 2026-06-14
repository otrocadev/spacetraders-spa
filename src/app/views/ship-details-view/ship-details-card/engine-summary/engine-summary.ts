import { Component, computed, input } from '@angular/core';
import { StSurfaceComponent, StProgressComponent } from '@otrocadev/orbital-spacetraders-ds';
import { IconTitleComponent } from '../../../../shared/directives/icon-title/icon-title.directive';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { ShipEngine } from '../../../../core/ship-management/ship-management';
import { ITablerIcon } from 'ngx-tabler-icons';

@Component({
  selector: 'app-engine-summary',
  imports: [
    StSurfaceComponent,
    StProgressComponent,
    IconTitleComponent,
    TooltipDirective,
    ITablerIcon,
  ],
  templateUrl: './engine-summary.html',
  styleUrl: './engine-summary.scss',
})
export class EngineSummary {
  readonly engineDetails = input.required<ShipEngine>();

  readonly engineCondition = computed(() => Math.round(this.engineDetails().condition * 100));
  readonly engineIntegrity = computed(() => Math.round(this.engineDetails().integrity * 100));
}
