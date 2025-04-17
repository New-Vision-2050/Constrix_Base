import { SystemTab } from "@/modules/settings/types/SystemTab";
import UserStatusTab from "./nested-tabs/user-status";

export const UserActionsTabsList: SystemTab[] = [
  {
    id: "user-actions-tabs-user-status",
    title: "حالة المستخدم",
    content: <UserStatusTab />,
  },
  {
    id: "user-actions-tabs-sms",
    title: "الرسائل النصية",
    content: <>الرسائل النصية</>,
  },
  {
    id: "user-actions-tabs-social-platforms",
    title: "منصات التواصل",
    content: <>منصات التواصل</>,
  },
];
