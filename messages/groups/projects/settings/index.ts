import { MessagesGroup } from "../../../types";
import { projectTypesMessages } from "./project-types";
import { SectionMessages } from "./work-order/section";
import { WorkOrdersMessages } from "./work-order/work-order-type";
import { ActionsMessages } from "./work-order/actions";
import { ReportFormsMessages } from "./work-order/report-forms";

export const projectSettingsMessages = new MessagesGroup({
  projectTypes: projectTypesMessages,
  workOrders: WorkOrdersMessages,
  section: SectionMessages,
  actions: ActionsMessages,
  reportForms: ReportFormsMessages,
});
