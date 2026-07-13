import type { WorkOrderEntry } from "./AddWorkOrderDialog";
import type {
  CreateProjectOrderPermitWorkOrderArgs,
  CreateProjectOrderPermitsArgs,
} from "@/services/api/projects/project-order-permits/types/params";
import type { ProjectSharingWorkOrderPayload } from "@/services/api/projects/project-sharing-work-orders/types/response";

function parsePrice(value: string): number {
  const num = Number(value.replace(/,/g, ""));
  return Number.isNaN(num) ? 0 : num;
}

function parseCoordinate(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  return Number.isNaN(num) ? undefined : num;
}

export function buildCreateWorkOrdersPayload(
  projectId: string,
  entries: WorkOrderEntry[],
  orderPermits: ProjectSharingWorkOrderPayload[],
): CreateProjectOrderPermitsArgs {
  const orderPermitById = new Map(
    orderPermits.map((item) => [String(item.id), item]),
  );

  return {
    project_id: projectId,
    work_orders: entries.map((entry) => {
      const orderPermit = entry.workOrderType
        ? orderPermitById.get(entry.workOrderType)
        : undefined;

      const workOrder: CreateProjectOrderPermitWorkOrderArgs = {
        name: entry.workOrderId.trim(),
        type: orderPermit?.type?.trim() || "",
        assigned_date: entry.assignmentDate,
        contractor_id: entry.contractor,
        price: parsePrice(entry.price),
      };

      if (entry.workOrderType) {
        workOrder.order_permit_id = Number(entry.workOrderType);
      }

      if (entry.management) {
        workOrder.order_permit_department_id = Number(entry.management);
      }

      const stateId = entry.location.trim();
      if (stateId) {
        workOrder.state_id = stateId;
      }

      const lat = parseCoordinate(entry.lat);
      if (lat !== undefined) {
        workOrder.lat = lat;
      }

      const long = parseCoordinate(entry.long);
      if (long !== undefined) {
        workOrder.long = long;
      }

      return workOrder;
    }),
  };
}
