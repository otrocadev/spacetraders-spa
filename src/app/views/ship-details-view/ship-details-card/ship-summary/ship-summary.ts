import { Component, computed, input } from '@angular/core';
import { StSurfaceComponent, StProgressComponent } from '@otrocadev/orbital-spacetraders-ds';
import { BadgeComponent } from '../../../../shared/components/badge/badge';
import { HoverDetailsPanel } from '../../../../shared/components/hover-details-panel/hover-details-panel';
import { ShipDetails } from '../../../../core/ship-management/ship-management';
import { IconTitleComponent } from '../../../../shared/directives/icon-title/icon-title.directive';

@Component({
  selector: 'app-ship-summary',
  imports: [
    StSurfaceComponent,
    BadgeComponent,
    StProgressComponent,
    IconTitleComponent,
    HoverDetailsPanel,
  ],
  templateUrl: './ship-summary.html',
  styleUrl: './ship-summary.scss',
})
export class ShipSummary {
  readonly shipDetails = input.required<ShipDetails>();

  readonly powerRequirement = computed(() => {
    const modulePower = this.shipDetails().modules.reduce(
      (sum, module) => sum + module.requirements.power,
      0,
    );
    const mountPower = this.shipDetails().mounts.reduce(
      (sum, mount) => sum + mount.requirements.power,
      0,
    );

    return (
      this.shipDetails().frame.requirements.power +
      this.shipDetails().engine.requirements.power +
      modulePower +
      mountPower
    );
  });

  readonly powerBalance = computed(
    () => this.shipDetails().reactor.powerOutput - this.powerRequirement(),
  );

  readonly powerBreakdown = computed(() => [
    {
      label: 'Frame',
      detail: this.shipDetails().frame.name,
      value: this.shipDetails().frame.requirements.power,
    },
    {
      label: 'Engine',
      detail: this.shipDetails().engine.name,
      value: this.shipDetails().engine.requirements.power,
    },
    ...this.shipDetails().modules.map((module) => ({
      label: 'Module',
      detail: module.name,
      value: module.requirements.power,
    })),
    ...this.shipDetails().mounts.map((mount) => ({
      label: 'Mount',
      detail: mount.name,
      value: mount.requirements.power,
    })),
  ]);
}
