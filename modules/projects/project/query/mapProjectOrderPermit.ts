import type { WorkOrderRow } from "@/modules/projects/project/components/project-tabs/tabs/work-orders/types";
import type { ProjectOrderPermitWorkOrderDto } from "@/services/api/projects/project-order-permits/types/response";

function pickString(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

function resolveDate(value: string | null | undefined): string {
  const raw = value?.trim() ?? "";
  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

function resolveCoordinate(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
}

export function mapProjectOrderPermitDto(
  dto: ProjectOrderPermitWorkOrderDto,
): WorkOrderRow {
  return {
    id: String(dto.id),
    workOrderId: pickString(dto.name),
    workOrderType: pickString(
      dto.order_permit?.code,
      dto.order_permit?.description,
      dto.order_permit?.type,
      dto.type,
    ),
    consultantWorkOrderType: pickString(dto.order_permit?.type),
    departmentName: pickString(dto.order_permit?.department_name),
    orderPermitDescription: pickString(dto.order_permit?.description),
    udsPeriod: pickString(dto.order_permit?.uds_period),
    assignmentDate: resolveDate(dto.assigned_date),
    contractor: pickString(
      dto.contractor_name,
      dto.contractor?.name,
      dto.contractor?.contractor_name,
    ),
    management: pickString(
      dto.project_management_name,
      dto.order_permit_department?.description,
      dto.order_permit_department?.code,
    ),
    location: pickString(
      dto.projects_district_name,
      dto.state_name,
      dto.state?.name,
    ),
    latitude: resolveCoordinate(dto.lat),
    longitude: resolveCoordinate(dto.long),
    price: toNumber(dto.price),
    executingEntity: pickString(dto.executing_entity),
    office: pickString(dto.office),
    consultantCurrentBasket: pickString(dto.consultant_current_basket),
    consultantAssignmentDate: resolveDate(dto.consultant_assignment_date),
    consultantLastProcedureCode: pickString(dto.consultant_last_procedure_code),
    consultantLastProcedureDate: resolveDate(dto.consultant_last_procedure_date),
    consultantColumn155EntryDate: resolveDate(dto.consultant_column_155_entry_date),
    contractorLastProcedureCode: pickString(dto.contractor_last_procedure_code),
    contractorLastProcedureDate: resolveDate(dto.contractor_last_procedure_date),
    contractorColumn155EntryDate: resolveDate(dto.contractor_column_155_entry_date),
    materialBalanceElecContractor: resolveCoordinate(
      dto.material_balance_elec_contractor,
    ),
    contractorWorkOrderStatus: pickString(dto.contractor_work_order_status),
    contractorBasket: pickString(dto.contractor_basket),
    consultantPrice: toNumber(dto.consultant_price),
  };
}
