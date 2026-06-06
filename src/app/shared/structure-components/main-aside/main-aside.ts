import { Component, inject, input } from '@angular/core';
import { MainAsideNavItem } from './main-aside-nav-item/main-aside-nav-item';
import { StStatComponent, StButtonComponent } from '@otrocadev/orbital-spacetraders-ds';
import { TablerIcon } from '../../types/tabler-icons';
import { SessionStore } from '../../../core/session-management/session-management.store';
import { AgentStore } from '../../../core/agent-management/agent-management.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-aside',
  imports: [MainAsideNavItem, StStatComponent, StButtonComponent],
  templateUrl: './main-aside.html',
  styleUrl: './main-aside.scss',
})
export class MainAside {
  private readonly _sessionStore = inject(SessionStore);
  private readonly _agentStore = inject(AgentStore);
  private readonly _router = inject(Router);

  public readonly agentName = input.required<string>();
  public readonly navItems = input.required<
    Array<{
      name: string;
      route: string;
      icon: TablerIcon;
      currentCount?: number;
    }>
  >();

  public logout(): void {
    this._sessionStore.clearToken();
    this._agentStore.clearAgentSession();
    this._router.navigateByUrl('/login');
  }
}
