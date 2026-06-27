"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import {
  PROJECT_NOTIFICATION_LIST,
  PROJECT_NOTIFICATION_VIEW,
} from "@/modules/projects/project/constants/projectPermissionKeys";
import {
  hasAnyProjectPermissionKey,
} from "@/modules/projects/project/utils/projectMyPermissions";
import ProjectNotificationsView from "./components/ProjectNotificationsView";

const TABS = [
  { id: "notifications", labelKey: "notifications" },
  { id: "violations", labelKey: "violations" },
  { id: "reports", labelKey: "reports" },
  { id: "indicators", labelKey: "indicators" },
] as const;

export default function MaintenanceEmergencyTab() {
  const t = useTranslations("project.maintenanceEmergency");
  const tCommon = useTranslations("common");
  const { projectId } = useProject();
  const [activeTab, setActiveTab] = useState<string>("notifications");

  const { data: flatPerms, isLoading: isLoadingPerms } =
    useProjectMyPermissionsFlat(projectId);

  const canView = useMemo(
    () =>
      hasAnyProjectPermissionKey(flatPerms, [
        PROJECT_NOTIFICATION_VIEW,
        PROJECT_NOTIFICATION_LIST,
      ]),
    [flatPerms],
  );

  if (!projectId) {
    return null;
  }

  if (isLoadingPerms) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!canView) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{tCommon("noProjectTabPermission")}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={t(`tabs.${tab.labelKey}`)}
          />
        ))}
      </Tabs>

      {activeTab === "notifications" && <ProjectNotificationsView />}
      {activeTab !== "notifications" && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="info">{t("comingSoon")}</Alert>
        </Box>
      )}
    </Box>
  );
}
