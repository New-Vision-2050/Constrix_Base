"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList } from "lucide-react";
import type { SystemTab } from "@/modules/settings/types/SystemTab";
import WorkOrdersTab from "../tabs/work-orders";
import WorkOrdersDepartmentTab from "../tabs/work-orders/departments";
import {
  getProjectOrderPermitDepartmentLabel,
  useProjectOrderPermitDepartmentsList,
} from "@/modules/projects/project/query/useProjectOrderPermitDepartmentsList";

type ConstructionsTabPrefix = "project" | "engagement";

export function useConstructionsNestedTabs(
  prefix: ConstructionsTabPrefix,
): SystemTab[] {
  const tProject = useTranslations("project");
  const { data: departments = [] } = useProjectOrderPermitDepartmentsList();

  return useMemo(() => {
    const departmentTabs: SystemTab[] = departments.map((department) => ({
      id: `${prefix}-tab-department-${department.id}`,
      title: getProjectOrderPermitDepartmentLabel(department),
      content: <WorkOrdersDepartmentTab departmentId={department.id} />,
    }));

    const permitsTab: SystemTab = {
      id: `${prefix}-tab-work-orders`,
      title: tProject("tabs.workOrders"),
      icon: <ClipboardList className="w-4 h-4" />,
      content: <WorkOrdersTab />,
    };

    return [...departmentTabs, permitsTab];
  }, [departments, prefix, tProject]);
}
