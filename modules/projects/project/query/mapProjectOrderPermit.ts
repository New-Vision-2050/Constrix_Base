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

function resolveActive(dto: ProjectOrderPermitWorkOrderDto): boolean {
  const raw = dto.active ?? dto.is_active;
  if (raw === true || raw === 1 || raw === "1") return true;
  if (raw === false || raw === 0 || raw === "0") return false;
  return true;
}

function resolveDate(dto: ProjectOrderPermitWorkOrderDto): string {
  const raw = pickString(dto.updated_at, dto.assigned_date);
  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

export function mapProjectOrderPermitDto(
  dto: ProjectOrderPermitWorkOrderDto,
  serial: number,
): WorkOrderRow {
  return {
    id: String(dto.id),
    serial,
    contractCode: pickString(dto.contract_code, dto.name),
    clientCode: pickString(dto.client_code),
    stationCode: pickString(dto.station_code),
    stationName: pickString(dto.station_name, dto.state?.name, dto.name),
    governorate: pickString(dto.governorate, dto.state?.name),
    contractingParty: pickString(
      dto.contracting_party,
      dto.contractor?.name,
      dto.contractor?.contractor_name,
    ),
    type: pickString(
      dto.type,
      dto.order_permit?.type,
      dto.order_permit?.description,
      dto.order_permit?.code,
    ),
    price: toNumber(dto.price),
    indebtedness: toNumber(dto.indebtedness),
    representative: pickString(dto.representative),
    supervisor: pickString(dto.supervisor),
    guidanceAndRegions: pickString(dto.guidance_and_regions),
    route: pickString(dto.route),
    defaultValue: toNumber(dto.default_value),
    availableBalance: toNumber(dto.available_balance),
    cashBalance: toNumber(dto.cash_balance),
    posMachinesCount: toNumber(dto.pos_machines_count),
    pcMachinesCount: toNumber(dto.pc_machines_count),
    totalMachinesCount: toNumber(dto.total_machines_count),
    cashier: pickString(dto.cashier),
    simLinesCount: toNumber(dto.sim_lines_count),
    pcSimLinesCount: toNumber(dto.pc_sim_lines_count),
    totalLinesCount: toNumber(dto.total_lines_count),
    bank: pickString(dto.bank),
    bankAccountNumber: pickString(dto.bank_account_number),
    bankClientCode: pickString(dto.bank_client_code),
    bankAccountName: pickString(dto.bank_account_name),
    collectionParty: pickString(dto.collection_party),
    paymentType: pickString(dto.payment_type),
    paymentMethod: pickString(dto.payment_method),
    value:
      dto.value != null && dto.value !== ""
        ? toNumber(dto.value)
        : toNumber(dto.price),
    paymentStatus: pickString(dto.payment_status),
    active: resolveActive(dto),
    block: pickString(dto.block),
    dataUpdatedAt: resolveDate(dto),
    updatedByUser: pickString(dto.updated_by_user, dto.updated_by),
  };
}
