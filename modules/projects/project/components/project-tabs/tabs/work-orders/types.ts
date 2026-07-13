export interface WorkOrderRow {
  id: string;
  serial: number;
  contractCode: string;
  clientCode: string;
  stationCode: string;
  stationName: string;
  governorate: string;
  contractingParty: string;
  type: string;
  price: number;
  indebtedness: number;
  representative: string;
  supervisor: string;
  guidanceAndRegions: string;
  route: string;
  defaultValue: number;
  availableBalance: number;
  cashBalance: number;
  posMachinesCount: number;
  pcMachinesCount: number;
  totalMachinesCount: number;
  cashier: string;
  simLinesCount: number;
  pcSimLinesCount: number;
  totalLinesCount: number;
  bank: string;
  bankAccountNumber: string;
  bankClientCode: string;
  bankAccountName: string;
  collectionParty: string;
  paymentType: string;
  paymentMethod: string;
  value: number;
  paymentStatus: string;
  active: boolean;
  block: string;
  dataUpdatedAt: string;
  updatedByUser: string;
}

export interface WorkOrderFilters {
  contractCode: string;
  type: string;
  stationName: string;
  projectStartDate: string;
  projectEndDate: string;
  contractingParty: string;
  paymentStatus: string;
}

export const EMPTY_WORK_ORDER_FILTERS: WorkOrderFilters = {
  contractCode: "",
  type: "",
  stationName: "",
  projectStartDate: "",
  projectEndDate: "",
  contractingParty: "",
  paymentStatus: "",
};

export type WorkOrderColumnKey =
  | "serial"
  | "contractCode"
  | "clientCode"
  | "stationCode"
  | "stationName"
  | "governorate"
  | "contractingParty"
  | "type"
  | "price"
  | "indebtedness"
  | "representative"
  | "supervisor"
  | "guidanceAndRegions"
  | "route"
  | "defaultValue"
  | "availableBalance"
  | "cashBalance"
  | "posMachinesCount"
  | "pcMachinesCount"
  | "totalMachinesCount"
  | "cashier"
  | "simLinesCount"
  | "pcSimLinesCount"
  | "totalLinesCount"
  | "bank"
  | "bankAccountNumber"
  | "bankClientCode"
  | "bankAccountName"
  | "collectionParty"
  | "paymentType"
  | "paymentMethod"
  | "value"
  | "paymentStatus"
  | "active"
  | "block"
  | "dataUpdatedAt"
  | "updatedByUser"
  | "actions";

/** Column order: right → left (RTL). */
export const WORK_ORDER_COLUMN_KEYS: WorkOrderColumnKey[] = [
  "serial",
  "contractCode",
  "clientCode",
  "stationCode",
  "stationName",
  "governorate",
  "contractingParty",
  "type",
  "price",
  "indebtedness",
  "representative",
  "supervisor",
  "guidanceAndRegions",
  "route",
  "defaultValue",
  "availableBalance",
  "cashBalance",
  "posMachinesCount",
  "pcMachinesCount",
  "totalMachinesCount",
  "cashier",
  "simLinesCount",
  "pcSimLinesCount",
  "totalLinesCount",
  "bank",
  "bankAccountNumber",
  "bankClientCode",
  "bankAccountName",
  "collectionParty",
  "paymentType",
  "paymentMethod",
  "value",
  "paymentStatus",
  "active",
  "block",
  "dataUpdatedAt",
  "updatedByUser",
  "actions",
];
