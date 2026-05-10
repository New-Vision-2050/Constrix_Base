import { Dispatch, SetStateAction } from "react";

/** Project sharing work order (API: project-sharing-work-orders) */
export interface ProjectSharingWorkOrder {
  id: number;
  project_type_id: number;
  code: string;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use ProjectSharingWorkOrder */
export type WorkOrderType = ProjectSharingWorkOrder;

/** Project sharing department (API: project-sharing-department) — UI «Section». */
export interface ProjectSharingDepartment {
  id: number;
  project_type_id: number;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use ProjectSharingDepartment */
export type Section = ProjectSharingDepartment;

/** Project sharing procedure (API: project-sharing-procedure) — UI «Action». */
export interface ProjectSharingProcedure {
  id: number;
  project_type_id: number;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use ProjectSharingProcedure */
export type Action = ProjectSharingProcedure;

export interface ReportForm {
  id: string;
  referenceNumber: string;
  formName: string;
  workOrderType: string;
  notes: string;
}

export interface Task {
  id: string;
  tasksNumber: number;
  tasksName: string;
}

export interface TaskSetting {
  id: string;
  workOrderType: string;
  tasks: string;
}

export interface RowActionsProps {
  row:
    | ProjectSharingWorkOrder
    | Section
    | ProjectSharingProcedure
    | ReportForm
    | Task
    | TaskSetting;
  onShow: (id: string) => void;
  onEdit: (id: string) => void;
  canEdit: boolean;
  canShow: boolean;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
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
