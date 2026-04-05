import type { ProjectAttachmentsSearchFormData } from "../../types";

export type { ProjectAttachmentsSearchFormData };

export interface DropdownOption {
  value: string;
  label: string;
}

export interface ProjectAttachmentsSearchFieldsProps {
  data: ProjectAttachmentsSearchFormData;
  onChange: (data: ProjectAttachmentsSearchFormData) => void;
  className?: string;
  isLoading?: boolean;
}
