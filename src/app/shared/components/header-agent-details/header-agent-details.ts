import { Component, input } from '@angular/core';
import { FactionChip } from '../faction-chip/faction-chip';
import { FactionSymbol } from '../../../core/faction-management/faction-management';
import { IconChip } from '../icon-chip/icon-chip';

@Component({
  selector: 'app-header-agent-details',
  imports: [FactionChip, IconChip],
  templateUrl: './header-agent-details.html',
  styleUrl: './header-agent-details.scss',
})
export class HeaderAgentDetails {
  factionSymbol = input.required<FactionSymbol | 'loading' | null>();
  credits = input.required<number | 'loading' | null>();
}
