"use client";

import { useState } from "react";
import { Banknote, CalendarDays, ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import LeavesTab from "./leaves";
import AdvancesTab from "./advances";
import UserLeaveRequestsList from "./leaves/components/UserLeaveRequestsList";

const LEAVES_TAB_ID = "contract-settings-tab-leaves";
const ADVANCES_TAB_ID = "contract-settings-tab-advances";
const LEAVE_REQUESTS_TAB_ID = "contract-settings-tab-leave-requests";

export default function ContractSettingsTab({ userId }: { userId: string }) {
  const t = useTranslations("UserProfile.tabs.contractTabs.contractSettings");
  const { can } = usePermissions();
  const [activeTab, setActiveTab] = useState(LEAVES_TAB_ID);

  const list = [
    {
      id: LEAVES_TAB_ID,
      title: t("leaves"),
      icon: <CalendarDays />,
      content: <LeavesTab userId={userId} />,
      // Spec: hide without `leave-policy.assign`. Fallback to LEAVE_POLICY_VIEW
      // until the backend registers the assign key (OR logic).
      show: can([
        PERMISSIONS.vacations.settings.leavePolicy.assign,
        PERMISSIONS.vacations.settings.leavePolicy.view,
      ]),
    },
    {
      id: LEAVE_REQUESTS_TAB_ID,
      title: t("leaveRequests"),
      icon: <ClipboardList />,
      content: <UserLeaveRequestsList userId={userId} />,
      // `leave-request.list` is not in the backend catalog yet either —
      // fall back to LEAVE_POLICY_VIEW until it ships.
      show: can([
        PERMISSIONS.vacations.leaveRequests.list,
        PERMISSIONS.vacations.settings.leavePolicy.view,
      ]),
    },
    {
      id: ADVANCES_TAB_ID,
      title: t("advances"),
      icon: <Banknote />,
      content: <AdvancesTab userId={userId} />,
      show: true,
    },
  ].filter((tab) => tab.show);

  const effectiveActiveTab = list.some((tab) => tab.id === activeTab)
    ? activeTab
    : (list[0]?.id ?? LEAVES_TAB_ID);

  return (
    <HorizontalTabs
      value={effectiveActiveTab}
      defaultValue={effectiveActiveTab}
      onTabClick={(tab) => setActiveTab(tab.id)}
      list={list}
    />
  );
}
