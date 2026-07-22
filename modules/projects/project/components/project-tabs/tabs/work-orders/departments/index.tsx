"use client";

import WorkOrdersTab from "../index";

type WorkOrdersDepartmentTabProps = {
  departmentId: number;
};

export default function WorkOrdersDepartmentTab({
  departmentId,
}: WorkOrdersDepartmentTabProps) {
  return <WorkOrdersTab departmentId={departmentId} />;
}
