export * from "./createRequest";
export * from "./getRequests";
export * from "./getRequestDetails";
export * from "./updateRequest";
export * from "./updateRequestStatus";
export * from "./deleteRequest";
export * from "./getAvailableStatuses";
export * from "../../shared/clients/getClients";

import { createRequest } from "./createRequest";
import { getRequests } from "./getRequests";
import { getRequestDetails } from "./getRequestDetails";
import { updateRequest } from "./updateRequest";
import { updateRequestStatus } from "./updateRequestStatus";
import { deleteRequest } from "./deleteRequest";
import { getAvailableStatuses } from "./getAvailableStatuses";
import { getClients } from "../../shared/clients/getClients";

export const RequestsApi = {
  create: createRequest,
  list: getRequests,
  getDetails: getRequestDetails,
  update: updateRequest,
  updateStatus: updateRequestStatus,
  delete: deleteRequest,
  getAvailableStatuses: getAvailableStatuses,
  getClients: getClients,
};
