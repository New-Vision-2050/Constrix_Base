import { Dispatch, SetStateAction } from "react";

export interface WorkOrderType {
  id: string;
  consultantCode: number;
  description: string;
  type: number;
  workOrderDescription?: string;
  workOrderType?: number;
  taskId?: string;
  procedureId?: string;
}

export interface Section {
  id: string;
  sectionCode: number;
  sectionDescription: string;
}

export interface Action {
  id: string;
  code: number;
  description: string;
}

export interface ReportForm {
  id: string;
  referenceNumber: string;
  formName: string;
  workOrderType: string;
  notes: string;
}

export interface RowActionsProps {
  row: WorkOrderType | Section | Action | ReportForm;
  onShow: (id: string) => void;
  onEdit: (id: string) => void;
  canEdit: boolean;
  canShow: boolean;
  t?: (key: string) => string;
  /** Translation namespace for table labels (e.g. "projectSettings.section.table" or "projectSettings.actions.table") */
  translationNamespace?: string;
  /** Key for edit menu item (e.g. "editSection" or "editAction") */
  editLabelKey?: string;
}

export type ActionType = "display" | "edit";

export interface DetailsDialogProps {
  open: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  rowId: string | null;
}

export interface TasksType {
  id: string;
  desc: string;
}
