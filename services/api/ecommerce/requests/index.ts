export * from "./createRequest";
export * from "./getRequests";
export * from "./getRequestDetails";
export * from "./updateRequest";
export * from "./updateRequestStatus";
export * from "./deleteRequest";
export * from "./getAvailableStatuses";

import { createRequest } from "./createRequest";
import { getRequests } from "./getRequests";
import { getRequestDetails } from "./getRequestDetails";
import { updateRequest } from "./updateRequest";
import { updateRequestStatus } from "./updateRequestStatus";
import { deleteRequest } from "./deleteRequest";
import { getAvailableStatuses } from "./getAvailableStatuses";

export const RequestsApi = {
  create: createRequest,
  list: getRequests,
  getDetails: getRequestDetails,
  update: updateRequest,
  updateStatus: updateRequestStatus,
  delete: deleteRequest,
  getAvailableStatuses: getAvailableStatuses,
};
