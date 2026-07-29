export type ListProjectSafetyVisitsParams = {
  page?: number;
  per_page?: number;
  search?: string;
  date?: string;
  consultantEngineer?: string;
  consultant?: string;
  contractorId?: string;
  assignedUserId?: string;
};

export function buildListProjectSafetyVisitsParams(
  params: ListProjectSafetyVisitsParams,
): Record<string, string> {
  const query: Record<string, string> = {};

  if (params.page != null) query.page = String(params.page);
  if (params.per_page != null) query.per_page = String(params.per_page);

  const search = params.search?.trim();
  if (search) query.search = search;

  if (params.date) query.date = params.date;

  const consultantEngineer = params.consultantEngineer?.trim();
  if (consultantEngineer) query.consultantEngineer = consultantEngineer;

  const consultant = params.consultant?.trim();
  if (consultant) query.consultant = consultant;

  if (params.contractorId) query.contractorId = params.contractorId;

  if (params.assignedUserId) query.assignedUserId = params.assignedUserId;

  return query;
}

/** @deprecated Use ListProjectSafetyVisitsParams */
export type SafetyVisitsListParams = ListProjectSafetyVisitsParams;

/** @deprecated Use buildListProjectSafetyVisitsParams */
export const buildSafetyVisitsListParams = buildListProjectSafetyVisitsParams;
