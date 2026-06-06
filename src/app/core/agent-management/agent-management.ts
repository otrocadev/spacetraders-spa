import { FactionSymbol } from '../faction-management/faction-management';

export interface AgentDetails {
  symbol: string;
  headquarters: string;
  credits: number;
  startingFaction: FactionSymbol;
  shipCount: number;
}

export interface AgentDetailsAPIResponse {
  data: AgentDetails;
}
