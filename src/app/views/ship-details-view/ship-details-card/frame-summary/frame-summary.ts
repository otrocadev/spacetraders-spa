import { Component, computed, input } from '@angular/core';
import { StSurfaceComponent, StProgressComponent } from '@otrocadev/orbital-spacetraders-ds';
import { IconTitleComponent } from '../../../../shared/directives/icon-title/icon-title.directive';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { ShipFrame } from '../../../../core/ship-management/ship-management';
import { ITablerIcon } from 'ngx-tabler-icons';

@Component({
  selector: 'app-frame-summary',
  imports: [
    StSurfaceComponent,
    StProgressComponent,
    IconTitleComponent,
    TooltipDirective,
    ITablerIcon,
  ],
  templateUrl: './frame-summary.html',
  styleUrl: './frame-summary.scss',
})
export class FrameSummary {
  readonly frameDetails = input.required<ShipFrame>();

  readonly frameCondition = computed(() => Math.round(this.frameDetails().condition * 100));
  readonly frameIntegrity = computed(() => Math.round(this.frameDetails().integrity * 100));
}
