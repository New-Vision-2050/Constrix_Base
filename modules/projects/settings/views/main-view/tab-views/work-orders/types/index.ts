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

export interface RowActionsProps {
  row: WorkOrderType | Section;
  onShow: (id: string) => void;
  onEdit: (id: string) => void;
  canEdit: boolean;
  canShow: boolean;
  t?: (key: string) => string;
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
