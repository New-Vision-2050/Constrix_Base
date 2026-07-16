export interface WorkOrderRow {
  id: string;
  workOrderId: string;
  workOrderType: string;
  assignmentDate: string;
  contractor: string;
  management: string;
  location: string;
  latitude: string;
  longitude: string;
  price: number;
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
  | "assignmentDate"
  | "contractor"
  | "management"
  | "location"
  | "latitude"
  | "longitude"
  | "price"
  | "actions";

/** Column order: right → left (RTL). */
export const WORK_ORDER_COLUMN_KEYS: WorkOrderColumnKey[] = [
  "workOrderId",
  "workOrderType",
  "assignmentDate",
  "contractor",
  "management",
  "location",
  "latitude",
  "longitude",
  "price",
  "actions",
];
