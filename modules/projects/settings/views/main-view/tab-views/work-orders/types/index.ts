import { Dispatch, SetStateAction } from "react";

export interface WorkOrderType {
  id: string;
  consultantCode: number;
  description: string;
  type: number;
}

export interface RowActionsProps {
  row: WorkOrderType;
  onShow: (id: string, action: string) => void;
  onEdit: (id: string, action: string) => void;
  canEdit: boolean;
  canShow: boolean;
  t?: (key: string) => string;
}

export type ActionType = "display" | "edit";

export interface DetailsDialogProps {
  open: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  rowId: string | null;
  action: ActionType | null;
}

export interface TasksType {
  id: string;
  desc: string;
}
