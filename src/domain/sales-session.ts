export interface SalesSession {
  id: string;
  agentId: string;
  clientId?: string;
  startedAt: string;
  endedAt?: string;
  selectedProjectIds: string[];
  selectedUnitIds: string[];
  shortlistedUnitIds: string[];
  notes?: string[];
}
