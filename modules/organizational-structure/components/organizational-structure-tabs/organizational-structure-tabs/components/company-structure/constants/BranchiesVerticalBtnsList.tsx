import { MapPin } from "lucide-react";
import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";

export const CompanyStructureBranch: UserProfileNestedTab[] = [
  {
    id: "company-structure-branch-1",
    title: "الفرع الرئيسي",
    icon: <MapPin />,
    content: <>الفرع الرئيسي</>,
    ignoreValidation: true,
  },
  {
    id: "company-structure-branch-2",
    title: "الفرع 2",
    icon: <MapPin />,
    content: <>الفرع 2</>,
    ignoreValidation: true,
  },
  {
    id: "company-structure-branch-3",
    title: "الفرع 3",
    icon: <MapPin />,
    content: <>الفرع 3</>,
    ignoreValidation: true,
  },
];
