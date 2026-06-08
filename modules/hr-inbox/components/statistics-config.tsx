"use client";

import { baseURL } from "@/config/axios-config";
import ArrowStaticIcon from "@/public/icons/arrow-static";
import PersonStaticIcon from "@/public/icons/person-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import CheckStatic from "@/public/icons/check-static";

export const hrInboxStatisticsConfig = {
  url: `${baseURL}/admin/employee-tasks/inbox-counts`,
  icons: [
    <ArrowStaticIcon key={1} />,
    <PersonStaticIcon key={2} />,
    <ChartStaticIcon key={3} />,
    <CheckStatic key={4} />,
  ],
  transformResponse: (payload: any) => [
    { title: "المهام المعلقة", number: payload?.pending_tasks ?? 0 },
    { title: "التمديدات المعلقة", number: payload?.pending_extensions ?? 0 },
    { title: "الموافقات المعلقة", number: payload?.pending_approvals ?? 0 },
    { title: "الإجمالي", number: payload?.total ?? 0 },
  ],
};
