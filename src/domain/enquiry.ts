export type EnquiryStatus =
  | "submitted"
  | "assigned"
  | "contacted"
  | "qualified"
  | "closed";

export interface Enquiry {
  id: string;
  userId?: string;
  projectId?: string;
  unitId?: string;
  name?: string;
  email?: string;
  message?: string;
  status: EnquiryStatus;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
}
