import { Component, input } from '@angular/core';
import { TablerIcon } from '../../../types/tabler-icons';
import { ITablerIcon } from 'ngx-tabler-icons';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-aside-nav-item',
  imports: [ITablerIcon, RouterLink, RouterLinkActive],
  templateUrl: './main-aside-nav-item.html',
  styleUrl: './main-aside-nav-item.scss',
})
export class MainAsideNavItem {
  itemDetails = input.required<{
    name: string;
    route: string;
    icon: TablerIcon;
    currentCount?: number;
  }>();
}
