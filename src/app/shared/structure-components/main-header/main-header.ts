import { Component, input } from '@angular/core';
import { HeaderAgentDetails } from '../../components/header-agent-details/header-agent-details';
import { AgentDetails } from '../../../core/agent-management/agent-management';

@Component({
  selector: 'app-main-header',
  imports: [HeaderAgentDetails],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  public readonly title = input.required<string>();
  public readonly agentDetails = input.required<AgentDetails | null>();
  public readonly error = input.required<string | null>();
}
