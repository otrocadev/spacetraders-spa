import { Pipe, PipeTransform } from '@angular/core';
import { FACTION_NAMES } from '../../core/faction-management/faction-management';

@Pipe({
  name: 'factionNamePipe',
  standalone: true,
})
export class FactionNamePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    return FACTION_NAMES[value as keyof typeof FACTION_NAMES] ?? value;
  }
}
