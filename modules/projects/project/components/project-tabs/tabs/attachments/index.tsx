"use client";

import { useMemo } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { PublicDocsCxtProvider } from "@/modules/docs-library/modules/publicDocs/contexts/public-docs-cxt";
import PublicDocsTabEntryPoint from "@/modules/docs-library/modules/publicDocs/views/public-docs-tab/entry-point";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import {
  PROJECT_ARCHIVE_CREATE,
  PROJECT_ARCHIVE_DELETE,
  PROJECT_ARCHIVE_LIST,
  PROJECT_ARCHIVE_UPDATE,
  PROJECT_ARCHIVE_VIEW,
} from "@/modules/projects/project/constants/projectPermissionKeys";
import {
  hasAnyProjectPermissionKey,
  hasProjectPermissionKey,
} from "@/modules/projects/project/utils/projectMyPermissions";

export default function AttachmentsTab() {
  const t = useTranslations("common");
  const { projectId } = useProject();
  const { data: flat, isLoading } = useProjectMyPermissionsFlat(projectId);

  const canView = useMemo(
    () =>
      hasAnyProjectPermissionKey(flat, [
        PROJECT_ARCHIVE_VIEW,
        PROJECT_ARCHIVE_LIST,
      ]),
    [flat],
  );

  const archiveGates = useMemo(
    () => ({
      canCreate: hasProjectPermissionKey(flat, PROJECT_ARCHIVE_CREATE),
      canUpdate: hasProjectPermissionKey(flat, PROJECT_ARCHIVE_UPDATE),
      canDelete: hasProjectPermissionKey(flat, PROJECT_ARCHIVE_DELETE),
    }),
    [flat],
  );

  if (!projectId) {
    return null;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!canView) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{t("noProjectTabPermission")}</Alert>
      </Box>
    );
  }

  return (
    <PublicDocsCxtProvider
      projectId={projectId}
      projectArchiveGates={archiveGates}
    >
      <PublicDocsTabEntryPoint />
    </PublicDocsCxtProvider>
  );
}
