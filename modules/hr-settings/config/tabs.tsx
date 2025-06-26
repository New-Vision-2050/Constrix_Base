import React from "react";
import { SystemTab } from "@/modules/settings/types/SystemTab";
import { CircleUser, Inbox } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";

// Tabs config for HR settings
export const HRSettingsTabs: SystemTab[] = [
  {
    id: "employee-positions",
    title: "الحضور و الانصراف",
    icon:<Inbox/>,
    content: <>الحضور و الانصراف</>,
  },
  {
    id: "departments",
    title: "التوظيف",
    icon:<CircleUser/>,
    content: <>التوظيف</>,
  },
  {
    id: "branches",
    title: "الخدمة",
    icon:<BackpackIcon/>,
    content: <>الخدمة</>,
  },
  {
    id: "job-titles",
    title: "ادارة عقد العمل",
    content: <>ادارة عقد العمل</>,
  },
];
