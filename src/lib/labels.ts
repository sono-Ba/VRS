import type { EnquiryStatus, ProjectStatus, UnitAvailability } from "@/domain";

/** Domain enums are API values; these are the words users read. */

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  launch: "New launch",
  selling: "Now selling",
  handover: "Ready",
};

export const AVAILABILITY_LABEL: Record<UnitAvailability, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

/** Wording for the client's own view of an enquiry. */
export const ENQUIRY_STATUS_CLIENT_LABEL: Record<EnquiryStatus, string> = {
  submitted: "Submitted",
  assigned: "With an advisor",
  contacted: "Advisor in touch",
  qualified: "In discussion",
  closed: "Closed",
};

/** Wording for staff surfaces, where the pipeline stage matters. */
export const ENQUIRY_STATUS_STAFF_LABEL: Record<EnquiryStatus, string> = {
  submitted: "New",
  assigned: "Assigned",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
};
