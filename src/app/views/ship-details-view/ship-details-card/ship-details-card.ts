import { Component, computed, input } from '@angular/core';
import { ShipDetails, ShipModule, ShipMount } from '../../../core/ship-management/ship-management';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import {
  StStatComponent,
  StSurfaceComponent,
  StTabComponent,
  StTabsComponent,
} from '@otrocadev/orbital-spacetraders-ds';
import { ShipInfoPanel, ShipInfoPanelMetric } from './ship-info-panel/ship-info-panel';
import { ShipLoadoutItem, ShipLoadoutItemMetric } from './ship-loadout-item/index';
import { ShipSummary } from './ship-summary/ship-summary';
import { CrewSummary } from './crew-summary/crew-summary';
import { NavigationSummary } from './navigation-summary/navigation-summary';

const SHIP_FRAME_IMAGES = new Set([
  'FRAME_DRONE',
  'FRAME_EXPLORER',
  'FRAME_FIGHTER',
  'FRAME_FRIGATE',
  'FRAME_INTERCEPTOR',
  'FRAME_PROBE',
  'FRAME_RACER',
  'FRAME_SHUTTLE',
]);

@Component({
  selector: 'app-ship-details-card',
  imports: [
    BadgeComponent,
    StSurfaceComponent,
    StStatComponent,
    StTabsComponent,
    StTabComponent,
    ShipInfoPanel,
    ShipLoadoutItem,
    ShipSummary,
    CrewSummary,
    NavigationSummary,
  ],
  templateUrl: './ship-details-card.html',
  styleUrl: './ship-details-card.scss',
})
export class ShipDetailsCard {
  readonly ship = input.required<ShipDetails>();

  readonly shipImg = computed(() => {
    const shipFrame = this.ship().frame.symbol;

    if (!SHIP_FRAME_IMAGES.has(shipFrame)) {
      return null;
    }

    return `assets/img/ship-frames/${shipFrame}.png`;
  });

  readonly hasActiveRoute = computed(() => {
    const route = this.ship().nav.route;
    return route.origin.symbol !== route.destination.symbol;
  });

  readonly frameMetrics = computed(() => {
    const frame = this.ship().frame;

    return [
      { label: 'Modules', value: frame.moduleSlots, tone: 'brand' },
      { label: 'Mounts', value: frame.mountingPoints },
      { label: 'Power', value: frame.requirements.power },
      { label: 'Crew', value: frame.requirements.crew },
    ] satisfies ShipInfoPanelMetric[];
  });

  readonly reactorMetrics = computed(() => {
    const reactor = this.ship().reactor;

    return [
      { label: 'Output', value: reactor.powerOutput, tone: 'brand' },
      { label: 'Crew', value: reactor.requirements.crew },
      { label: 'Condition', value: this.asPercent(reactor.condition) },
      { label: 'Integrity', value: this.asPercent(reactor.integrity), tone: 'accent' },
    ] satisfies ShipInfoPanelMetric[];
  });

  readonly engineMetrics = computed(() => {
    const engine = this.ship().engine;

    return [
      { label: 'Speed', value: engine.speed, tone: 'brand' },
      { label: 'Power', value: engine.requirements.power },
      { label: 'Crew', value: engine.requirements.crew },
      { label: 'Condition', value: this.asPercent(engine.condition), tone: 'accent' },
    ] satisfies ShipInfoPanelMetric[];
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
