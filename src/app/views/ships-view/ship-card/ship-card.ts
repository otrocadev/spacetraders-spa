import { Component, computed, input, output } from '@angular/core';
import { ShipDetails } from '../../../core/ship-management/ship-management';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { StStatComponent } from '@otrocadev/orbital-spacetraders-ds';

@Component({
  selector: 'app-ship-card',
  imports: [BadgeComponent, StStatComponent],
  templateUrl: './ship-card.html',
  styleUrl: './ship-card.scss',
})
export class ShipCard {
  ship = input.required<ShipDetails>();
  shipClicked = output<ShipDetails>();

  onCardClick(): void {
    this.shipClicked.emit(this.ship());
  }

  shipImg = computed(() => {
    const shipFrame = this.ship().frame.symbol;
    return `assets/img/ship-frames/${shipFrame}.png`;
  });
}
