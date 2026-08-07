import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  Gavel,
  MapPin,
  PauseCircle,
  Pencil,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

const ACTION_ICON_BY_FORM_KEY: Record<string, LucideIcon> = {
  confirmProjectNotificationPresence: MapPin,
  confirmProjectNotificationLocation: MapPin,
  updateProjectNotificationTask: Pencil,
  updateProjectNotificationSiteStatus: RefreshCw,
  projectNotificationFine: Gavel,
  projectNotificationWorkStoppageReport: ShieldAlert,
  projectNotificationWorkResumption: CheckCircle2,
  projectNotificationTaskPostponement: PauseCircle,
  endProjectNotificationTask: CheckCircle2,
};

export function getActionIcon(formKey: string): LucideIcon {
  return ACTION_ICON_BY_FORM_KEY[formKey] ?? FileText;
}

export function getActionHeaderIcon(): LucideIcon {
  return ClipboardList;
}
