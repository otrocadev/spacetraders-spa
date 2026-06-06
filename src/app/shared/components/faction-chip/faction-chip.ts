import { Component, computed, input } from '@angular/core';
import { StSurfaceComponent } from '@otrocadev/orbital-spacetraders-ds';
import { FactionNamePipe } from '../../pipes/faction-name.pipe';
import { FactionSymbol } from '../../../core/faction-management/faction-management';

@Component({
  selector: 'app-faction-chip',
  imports: [FactionNamePipe, StSurfaceComponent],
  templateUrl: './faction-chip.html',
  styleUrl: './faction-chip.scss',
})
export class FactionChip {
  faction = input.required<FactionSymbol | 'loading' | null>();

  factionImgSrc = computed(() => {
    const factionSymbol = this.faction();
    return factionSymbol ? `assets/img/faction-emblems/${factionSymbol}.png` : '';
  });
}
