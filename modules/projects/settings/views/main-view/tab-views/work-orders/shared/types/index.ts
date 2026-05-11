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

/** Report form (API: report-forms) */
export interface ProjectSharingReportForm {
  id: number;
  project_type_id: number;
  order_permit_procedure_id: number;
  name: string;
  question: string;
  value: string;
  number_of_attachments: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use ProjectSharingReportForm */
export type ReportForm = ProjectSharingReportForm;

/** Project sharing task (API: project-sharing-tasks) */
export interface ProjectSharingTask {
  id: number;
  project_type_id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use ProjectSharingTask */
export type Task = ProjectSharingTask;

/** Task setting link (API: project-sharing-tasks-setting) */
export interface ProjectSharingTaskSettingOrderPermit {
  id: number;
  code: string;
  description: string;
  type: string;
}

export interface ProjectSharingTaskSettingOrderPermitTask {
  id: number;
  code: string;
  name: string;
}

export interface ProjectSharingTaskSetting {
  id: number;
  project_type_id: number;
  order_permit: ProjectSharingTaskSettingOrderPermit;
  order_permit_task: ProjectSharingTaskSettingOrderPermitTask;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use ProjectSharingTaskSetting */
export type TaskSetting = ProjectSharingTaskSetting;

export interface RowActionsProps {
  row:
    | ProjectSharingWorkOrder
    | Section
    | ProjectSharingProcedure
    | ProjectSharingReportForm
    | ProjectSharingTask
    | ProjectSharingTaskSetting;
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
