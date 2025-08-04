import TabsGroup from "@/components/shared/TabsGroup";
import { Tab } from "@/types/Tab";
import { DollarSign, Lock, MapPin, Send, User, Users } from "lucide-react";
import OfficialData from "../official-data";
import Branches from "../branches";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const CompanyProfile: Tab[] = [
  {
    label: "البيانات الرسمية",
    icon: <User size={18} />,
    value: "official-data",
    component: (
      <Can check={[PERMISSIONS.companyProfile.officialData.view]}>
        <OfficialData />
      </Can>
    ),
  },
  {
    label: "الفروع",
    icon: <MapPin size={18} />,
    value: "branches",
    component: (
      <Can check={[PERMISSIONS.companyProfile.branch.prefix]}>
        <Branches />
      </Can>
    ),
  },
];

export const CompanyTabs: Tab[] = [
  {
    label: "ملف الشركة",
    icon: <User size={18} />,
    value: "company",
    component: (
      <TabsGroup
        tabs={CompanyProfile}
        defaultValue="official-data"
        variant="secondary"
        tabsListClassNames="justify-start gap-20"
      />
    ),
  },
  {
    label: "اعدادات الموقع والتطبيق",
    icon: <Users size={18} />,
    value: "location",
  },
  {
    label: "المشاريع",
    icon: <Lock size={18} />,
    value: "projects",
  },
  {
    label: "البيانات المالية",
    icon: <DollarSign size={18} />,
    value: "finance",
  },
  { label: "الاجازات", icon: <Send size={18} />, value: "leaves" },
  {
    label: "اجراءات المستخدم",
    icon: <Lock size={18} />,
    value: "user-actions",
  },
];
