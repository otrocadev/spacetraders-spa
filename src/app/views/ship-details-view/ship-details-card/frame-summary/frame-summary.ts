import { Component, computed, input } from '@angular/core';
import { ShipComponentCard } from '../ship-component-card/ship-component-card';
import { TooltipDirective } from '../../../../shared/directives/tooltip/tooltip.directive';
import { ShipFrame } from '../../../../core/ship-management/ship-management';
import { ITablerIcon } from 'ngx-tabler-icons';

@Component({
  selector: 'app-frame-summary',
  imports: [ShipComponentCard, TooltipDirective, ITablerIcon],
  templateUrl: './frame-summary.html',
  styleUrl: './frame-summary.scss',
})
export class FrameSummary {
  readonly frameDetails = input.required<ShipFrame>();

  readonly frameCondition = computed(() => Math.round(this.frameDetails().condition * 100));
  readonly frameIntegrity = computed(() => Math.round(this.frameDetails().integrity * 100));
}
