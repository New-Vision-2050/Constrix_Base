export interface WorkOrderRow {
  id: string;
  orderPermitDepartmentId: number | null;
  workOrderId: string;
  workOrderType: string;
  consultantWorkOrderType: string;
  departmentName: string;
  orderPermitDescription: string;
  orderPermitTypeName: string;
  udsPeriod: string;
  assignmentDate: string;
  contractor: string;
  management: string;
  location: string;
  latitude: string;
  longitude: string;
  price: number;
  executingEntity: string;
  office: string;
  consultantCurrentBasket: string;
  consultantAssignmentDate: string;
  consultantLastProcedureCode: string;
  consultantLastProcedureDate: string;
  consultantColumn155EntryDate: string;
  contractorLastProcedureCode: string;
  contractorLastProcedureDate: string;
  contractorColumn155EntryDate: string;
  materialBalanceElecContractor: string;
  contractorWorkOrderStatus: string;
  contractorBasket: string;
  consultantPrice: number;
}

export interface WorkOrderFilters {
  workOrderId: string;
  workOrderType: string;
  location: string;
  assignmentStartDate: string;
  assignmentEndDate: string;
  contractor: string;
}

export const EMPTY_WORK_ORDER_FILTERS: WorkOrderFilters = {
  workOrderId: "",
  workOrderType: "",
  location: "",
  assignmentStartDate: "",
  assignmentEndDate: "",
  contractor: "",
};

export type WorkOrderColumnKey =
  | "workOrderId"
  | "workOrderType"
  | "consultantWorkOrderType"
  | "departmentName"
  | "orderPermitDescription"
  | "orderPermitTypeName"
  | "udsPeriod"
  | "assignmentDate"
  | "contractor"
  | "management"
  | "location"
  | "latitude"
  | "longitude"
  | "price"
  | "executingEntity"
  | "office"
  | "consultantCurrentBasket"
  | "consultantAssignmentDate"
  | "consultantLastProcedureCode"
  | "consultantLastProcedureDate"
  | "consultantColumn155EntryDate"
  | "contractorLastProcedureCode"
  | "contractorLastProcedureDate"
  | "contractorColumn155EntryDate"
  | "materialBalanceElecContractor"
  | "contractorWorkOrderStatus"
  | "contractorBasket"
  | "consultantPrice"
  | "actions";

/** Column order: right → left (RTL). */
export const WORK_ORDER_COLUMN_KEYS: WorkOrderColumnKey[] = [
  "workOrderId",
  "workOrderType",
  "consultantWorkOrderType",
  "departmentName",
  "orderPermitDescription",
  "orderPermitTypeName",
  "udsPeriod",
  "assignmentDate",
  "contractor",
  "management",
  "location",
  "latitude",
  "longitude",
  "price",
  "executingEntity",
  "office",
  "consultantCurrentBasket",
  "consultantAssignmentDate",
  "consultantLastProcedureCode",
  "consultantLastProcedureDate",
  "consultantColumn155EntryDate",
  "contractorLastProcedureCode",
  "contractorLastProcedureDate",
  "contractorColumn155EntryDate",
  "materialBalanceElecContractor",
  "contractorWorkOrderStatus",
  "contractorBasket",
  "consultantPrice",
  "actions",
];
