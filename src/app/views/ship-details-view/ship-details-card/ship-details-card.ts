import { Component, computed, input } from '@angular/core';
import { ShipDetails, ShipModule, ShipMount } from '../../../core/ship-management/ship-management';
import {
  StSurfaceComponent,
  StTabComponent,
  StTabsComponent,
} from '@otrocadev/orbital-spacetraders-ds';
import { ShipLoadoutItem, ShipLoadoutItemMetric } from './ship-loadout-item/index';
import { ShipSummary } from './ship-summary/ship-summary';
import { CrewSummary } from './crew-summary/crew-summary';
import { NavigationSummary } from './navigation-summary/navigation-summary';
import { FrameSummary } from './frame-summary/frame-summary';
import { EngineSummary } from './engine-summary/engine-summary';
import { ReactorSummary } from './reactor-summary/reactor-summary';

@Component({
  selector: 'app-ship-details-card',
  imports: [
    StSurfaceComponent,
    StTabsComponent,
    StTabComponent,
    ShipLoadoutItem,
    ShipSummary,
    CrewSummary,
    NavigationSummary,
    FrameSummary,
    EngineSummary,
    ReactorSummary,
  ],
  templateUrl: './ship-details-card.html',
  styleUrl: './ship-details-card.scss',
})
export class ShipDetailsCard {
  readonly ship = input.required<ShipDetails>();

  readonly shipImg = computed(() => {
    const shipFrame = this.ship().frame.symbol;
    return `assets/img/ship-frames/${shipFrame}.png`;
  });

  readonly hasActiveRoute = computed(() => {
    const route = this.ship().nav.route;
    return route.origin.symbol !== route.destination.symbol;
  });

  readonly moduleItems = computed(() => {
    return this.ship().modules.map((module) => ({
      title: module.name,
      description: module.description,
      metrics: this.buildModuleMetrics(module),
    }));
  });

  readonly mountItems = computed(() => {
    return this.ship().mounts.map((mount) => ({
      title: mount.name,
      description: mount.description,
      metrics: this.buildMountMetrics(mount),
    }));
  });

  readonly cargoItems = computed(() => this.ship().cargo.inventory);

  formatLabel(value: string): string {
    return value.replaceAll('_', ' ');
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  asPercent(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  trackByLabel(index: number, item: { title?: string; name?: string; label?: string }): string {
    return `${index}-${item.title ?? item.name ?? item.label ?? 'item'}`;
  }

  private buildModuleMetrics(module: ShipModule): ShipLoadoutItemMetric[] {
    return [
      { label: 'Power', value: module.requirements.power, tone: 'brand' },
      { label: 'Crew', value: module.requirements.crew },
      { label: 'Slots', value: module.requirements.slots },
      ...(module.capacity
        ? [{ label: 'Capacity', value: module.capacity, tone: 'accent' as const }]
        : []),
    ];
  }

  private buildMountMetrics(mount: ShipMount): ShipLoadoutItemMetric[] {
    return [
      { label: 'Strength', value: mount.strength, tone: 'brand' },
      { label: 'Power', value: mount.requirements.power },
      { label: 'Crew', value: mount.requirements.crew },
      ...(mount.deposits?.length
        ? [{ label: 'Deposits', value: mount.deposits.length, tone: 'accent' as const }]
        : []),
    ];
  }
}
