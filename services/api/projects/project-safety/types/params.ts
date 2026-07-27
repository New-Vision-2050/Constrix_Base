export type ListProjectSafetyVisitsParams = {
  search?: string;
  date?: string;
  consultantEngineer?: string;
  consultant?: string;
  contractorId?: string;
  assignedUserId?: string;
};

export function buildListProjectSafetyVisitsParams(
  params: ListProjectSafetyVisitsParams,
): Record<string, string> | undefined {
  const query: Record<string, string> = {};

  const search = params.search?.trim();
  if (search) query.search = search;

  if (params.date) query.date = params.date;

  const consultantEngineer = params.consultantEngineer?.trim();
  if (consultantEngineer) query.consultantEngineer = consultantEngineer;

  const consultant = params.consultant?.trim();
  if (consultant) query.consultant = consultant;

  if (params.contractorId) query.contractorId = params.contractorId;

  if (params.assignedUserId) query.assignedUserId = params.assignedUserId;

  return Object.keys(query).length > 0 ? query : undefined;
}

/** @deprecated Use ListProjectSafetyVisitsParams */
export type SafetyVisitsListParams = ListProjectSafetyVisitsParams;

/** @deprecated Use buildListProjectSafetyVisitsParams */
export const buildSafetyVisitsListParams = buildListProjectSafetyVisitsParams;
