import { computed, inject } from '@angular/core';
import { AgentStore } from '../../../core/agent-management/agent-management.store';
import { navItems as asideMenuItems } from '../../../core/configs/aside-menu.config';

export class MainLayoutViewModel {
  private readonly _agentStore = inject(AgentStore);

  public readonly agentDetails = this._agentStore.agentDetails;
  public readonly agentDetailsError = this._agentStore.agentDetailsError;

  public readonly agentName = computed(() => this.agentDetails()?.symbol ?? 'loading');

  public readonly navItems = computed(() => {
    return asideMenuItems.map((item) => ({
      name: item.name,
      route: item.route,
      icon: item.icon,
      currentCount: item.hasCount ? this.agentDetails()?.shipCount : undefined,
    }));
  });
}
