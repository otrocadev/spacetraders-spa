import { Component, computed, input } from '@angular/core';
import { FactionNamePipe } from '../../pipes/faction-name.pipe';
import { FactionSymbol } from '../../../core/faction-management/faction-management';

@Component({
  selector: 'app-faction-chip',
  imports: [FactionNamePipe],
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
