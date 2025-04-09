import { SystemTab } from "@/modules/settings/types/SystemTab";
import UserContractTab from "../components/tabs/user-contract";
export const EditModeTabsList: SystemTab[] = [
  {
    id: "edit-mode-tabs-profile",
    title: "الملف الشخصي",
    content: <>الملف الشخصي</>,
  },
  {
    id: "edit-mode-tabs-contract",
    title: "عقد العمل",
    content: <UserContractTab />,
  },
  {
    id: "edit-mode-tabs-attendance",
    title: "سياسة الحضور",
    content: <>سياسة الحضور</>,
  },
  {
    id: "edit-mode-tabs-logs",
    title: "اجراءات المستخدم",
    content: <>اجراءات المستخدم</>,
  },
];
