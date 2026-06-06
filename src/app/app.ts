import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgentStore } from './core/agent-management/agent-management.store';
import { SessionStore } from './core/session-management/session-management.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('spacetraders--spa');

  private readonly agnentStore = inject(AgentStore);
  private readonly sessionStore = inject(SessionStore);

  ngOnInit(): void {
    const hasToken = this.sessionStore.restoreTokenFromSessionStorage();

    if (!hasToken) {
      return;
    }

    this.agnentStore.loadAgentDetails().subscribe();
  }
}
