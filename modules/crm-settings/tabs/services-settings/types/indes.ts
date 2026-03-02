export type AddServiceFormData = {
  name: string;
  term_services_ids: number[];
};

export interface AddServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectTypeId: number | null;
}
