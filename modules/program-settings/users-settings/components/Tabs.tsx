import TabsGroup from "@/components/shared/TabsGroup";
import { Tab } from "@/types/Tab";
import { Sheet, Table2, Settings, FileCog, Database } from "lucide-react";
import TableStructure from "./main-table/TableStructure";
import SubTables from "./sub-tables/SubTable";

export const MainTables: Tab[] = [
  {
    label: "هيكل الجدول",
    icon: <Database size={18} />,
    value: "structural-table",
    component: <TableStructure />,
  },
  {
    label: "محتويات الجدول",
    icon: <FileCog size={18} />,
    value: "table-content",
  },
  {
    label: "اعدادات الجدول",
    icon: <Settings size={18} />,
    value: "table-settings",
  },
];

export const UsersSettingsTab: Tab[] = [
  {
    label: "الجدول الرئيسي",
    icon: <Table2 size={18} />,
    value: "main",
    component: (
      <TabsGroup
        tabs={MainTables}
        defaultValue="structural-table"
        variant="secondary"
        tabsListClassNames="justify-start gap-20"
      />
    ),
  },
  {
    label: "الجداول الفرعية",
    icon: <Sheet size={18} />,
    value: "not-main",
    component: <SubTables />,
  },
];
