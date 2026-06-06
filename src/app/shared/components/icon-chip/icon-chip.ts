import { Component, input } from '@angular/core';
import { StSurfaceComponent } from '@otrocadev/orbital-spacetraders-ds';
import { ITablerIcon } from 'ngx-tabler-icons';
import { TablerIcon } from '../../types/tabler-icons';

@Component({
  selector: 'app-icon-chip',
  imports: [StSurfaceComponent, ITablerIcon],
  templateUrl: './icon-chip.html',
  styleUrl: './icon-chip.scss',
})
export class IconChip {
  displayText = input.required<string | number | 'loading' | null>();
  icon = input.required<TablerIcon>();
}
