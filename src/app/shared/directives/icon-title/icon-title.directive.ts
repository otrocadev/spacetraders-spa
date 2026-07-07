import { Component, input } from '@angular/core';
import { ITablerIcon } from 'ngx-tabler-icons';
import { TablerIcon } from '../../types/tabler-icons';

@Component({
  selector: 'app-icon-title',
  standalone: true,
  imports: [ITablerIcon],
  template: `
    <header class="st-icon-title">
      <i-tabler-icon [name]="icon()" [strokeWidth]="strokeWidth()" />
      <h3>{{ title() }}</h3>
    </header>
  `,
  styles: `
    .st-icon-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-bottom: 1rem;
    }

    .st-icon-title h3 {
      margin: 0;
    }
  `,
})
export class IconTitleComponent {
  readonly title = input.required<string>();
  readonly icon = input.required<TablerIcon>();
  readonly strokeWidth = input(1);
}
