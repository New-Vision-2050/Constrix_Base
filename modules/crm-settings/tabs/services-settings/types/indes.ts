import { ReactNode } from "react";
import type { TermServiceSettingItem } from "@/services/api/crm-settings/term-service-settings/types/response";

export type AddServiceFormData = {
  name: string;
  term_services_ids: number[];
};

export interface AddServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectTypeId?: number ;
}

export interface EditServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  item: TermServiceSettingItem | null;
  projectTypeId?: number ;
}

export type EditServiceFormData = AddServiceFormData;

export interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  deleteConfirmMessage?: ReactNode;
  deleteId: number | null;
}
