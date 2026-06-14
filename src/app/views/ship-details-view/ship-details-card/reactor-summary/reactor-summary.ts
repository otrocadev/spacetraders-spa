import { Component, computed, input } from '@angular/core';
import { StSurfaceComponent, StProgressComponent } from '@otrocadev/orbital-spacetraders-ds';
import { IconTitleComponent } from '../../../../shared/directives/icon-title/icon-title.directive';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { ShipReactor } from '../../../../core/ship-management/ship-management';
import { ITablerIcon } from 'ngx-tabler-icons';

@Component({
  selector: 'app-reactor-summary',
  imports: [
    StSurfaceComponent,
    StProgressComponent,
    IconTitleComponent,
    TooltipDirective,
    ITablerIcon,
  ],
  templateUrl: './reactor-summary.html',
  styleUrl: './reactor-summary.scss',
})
export class ReactorSummary {
  readonly reactorDetails = input.required<ShipReactor>();

  readonly reactorCondition = computed(() => Math.round(this.reactorDetails().condition * 100));
  readonly reactorIntegrity = computed(() => Math.round(this.reactorDetails().integrity * 100));
}
