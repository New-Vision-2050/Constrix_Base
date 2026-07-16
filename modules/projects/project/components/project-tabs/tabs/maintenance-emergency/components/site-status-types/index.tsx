"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Pencil, Trash2, List, CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useOptionalProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import {
  useSiteStatusTypes,
  useDeleteSiteStatusTypeMutation,
} from "@/modules/projects/project/query/useSiteStatusTypes";
import type { SiteStatusTypeWithKeys } from "@/services/api/projects/notifications/types/response";
import {
  hasAnyProjectPermissionKey,
  hasProjectPermissionKey,
} from "@/modules/projects/project/utils/projectMyPermissions";
import {
  PROJECT_NOTIFICATION_SITE_STATUS_TYPE_LIST,
  PROJECT_NOTIFICATION_SITE_STATUS_TYPE_VIEW,
  PROJECT_NOTIFICATION_SITE_STATUS_TYPE_CREATE,
  PROJECT_NOTIFICATION_SITE_STATUS_TYPE_UPDATE,
  PROJECT_NOTIFICATION_SITE_STATUS_TYPE_DELETE,
} from "@/modules/projects/project/constants/projectPermissionKeys";
import SiteStatusTypeDrawer from "./SiteStatusTypeDrawer";
import SiteStatusTypeKeysDrawer from "./SiteStatusTypeKeysDrawer";

const TableLayout = HeadlessTableLayout<SiteStatusTypeWithKeys>(
  "site-status-types-table",
);

interface SiteStatusTypesTabProps {
  projectTypeId?: string | number;
  projectId?: string | number;
}

export default function SiteStatusTypesTab({
  projectTypeId,
  projectId: projectIdProp,
}: SiteStatusTypesTabProps) {
  const t = useTranslations("project.maintenanceEmergency.siteStatusTypes");
  const tCommon = useTranslations("common");
  const projectContext = useOptionalProject();
  const projectId =
    projectIdProp !== undefined
      ? String(projectIdProp)
      : projectContext?.projectId;

  const { data: flatPerms, isLoading: isLoadingPerms } =
    useProjectMyPermissionsFlat(projectId);

  const permissions = useMemo(
    () =>
      projectId
        ? {
            canList: hasAnyProjectPermissionKey(flatPerms, [
              PROJECT_NOTIFICATION_SITE_STATUS_TYPE_VIEW,
              PROJECT_NOTIFICATION_SITE_STATUS_TYPE_LIST,
            ]),
            canCreate: hasProjectPermissionKey(
              flatPerms,
              PROJECT_NOTIFICATION_SITE_STATUS_TYPE_CREATE,
            ),
            canEdit: hasProjectPermissionKey(
              flatPerms,
              PROJECT_NOTIFICATION_SITE_STATUS_TYPE_UPDATE,
            ),
            canDelete: hasProjectPermissionKey(
              flatPerms,
              PROJECT_NOTIFICATION_SITE_STATUS_TYPE_DELETE,
            ),
          }
        : {
            canList: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
          },
    [flatPerms, projectId],
  );

  const listParams = useMemo(
    () => ({
      projectTypeId,
      projectId,
    }),
    [projectTypeId, projectId],
  );

  const { data, isLoading } = useSiteStatusTypes(listParams);
  const types = useMemo(() => data ?? [], [data]);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editType, setEditType] = useState<SiteStatusTypeWithKeys | undefined>();
  const [keysDrawerOpen, setKeysDrawerOpen] = useState(false);
  const [selectedTypeForKeys, setSelectedTypeForKeys] = useState<
    SiteStatusTypeWithKeys | undefined
  >();
  const [deleteTarget, setDeleteTarget] = useState<SiteStatusTypeWithKeys | null>(null);

  const deleteMutation = useDeleteSiteStatusTypeMutation(listParams);

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const filteredRows = useMemo(() => {
    return types.filter((type) => {
      const name = type.name_ar || type.name_en || "";
      if (
        filterName &&
        !name.toLowerCase().includes(filterName.toLowerCase())
      )
        return false;
      if (filterStatus === "active" && !type.is_active) return false;
      if (filterStatus === "inactive" && type.is_active) return false;
      return true;
    });
  }, [types, filterName, filterStatus]);

  const paginatedData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / params.limit));
  const totalItems = filteredRows.length;

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: t("nameAr"),
        sortable: false,
        render: (row: SiteStatusTypeWithKeys) => (
          <Typography variant="body2" fontWeight={500}>
            {row.name_ar || row.name_en}
          </Typography>
        ),
      },
      {
        key: "name_en",
        name: t("nameEn"),
        sortable: false,
        render: (row: SiteStatusTypeWithKeys) => (
          <Typography variant="body2" color="text.secondary">
            {row.name_en || "—"}
          </Typography>
        ),
      },
      {
        key: "keys_count",
        name: t("keysCount"),
        sortable: false,
        render: (row: SiteStatusTypeWithKeys) => (
          <Typography variant="body2">
            {(row.keys ?? []).length}
          </Typography>
        ),
      },
      {
        key: "sort_order",
        name: t("sortOrder"),
        sortable: false,
        render: (row: SiteStatusTypeWithKeys) => (
          <Typography variant="body2">{row.sort_order}</Typography>
        ),
      },
      {
        key: "is_active",
        name: t("isActive"),
        sortable: false,
        render: (row: SiteStatusTypeWithKeys) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Switch checked={row.is_active} disabled size="small" />
            <Typography variant="body2">
              {row.is_active ? t("isActive") : t("inactive")}
            </Typography>
          </Box>
        ),
      },
      {
        key: "actions",
        name: t("actions"),
        sortable: false,
        render: (row: SiteStatusTypeWithKeys) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                {t("action")}
              </Button>
            )}
          >
            <MenuItem
              onClick={() => {
                setSelectedTypeForKeys(row);
                setKeysDrawerOpen(true);
              }}
            >
              <List className="w-4 h-4 me-2" />
              {t("manageKeys")}
            </MenuItem>
            {permissions.canEdit ? (
              <MenuItem
                onClick={() => {
                  setEditType(row);
                  setDrawerOpen(true);
                }}
              >
                <Pencil className="w-4 h-4 me-2" />
                {t("edit")}
              </MenuItem>
            ) : null}
            {permissions.canDelete ? (
              <MenuItem
                onClick={() => setDeleteTarget(row)}
                sx={{ color: "error.main" }}
              >
                <Trash2 className="w-4 h-4 me-2" />
                {t("delete")}
              </MenuItem>
            ) : null}
          </CustomMenu>
        ),
      },
    ],
    [t, permissions],
  );

  const state = TableLayout.useTableState({
    data: paginatedData,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (row: SiteStatusTypeWithKeys) => row.id,
    loading: isLoading,
    searchable: true,
  });

  if (!projectTypeId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{t("loadError")}</Alert>
      </Box>
    );
  }

  if (isLoadingPerms) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!permissions.canList) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">{tCommon("noProjectTabPermission")}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 3 }}
        flexWrap="wrap"
        useFlexGap
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
            py: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            flex: 1,
            minWidth: 200,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "success.main",
              color: "white",
            }}
          >
            <CheckCircle2 className="h-5 w-5" />
          </Box>
          <Box sx={{ textAlign: "end", flex: 1 }}>
            <Box sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
              {t("isActive")}
            </Box>
            <Box sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
              {types.filter((t) => t.is_active).length}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
            py: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            flex: 1,
            minWidth: 200,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "error.main",
              color: "white",
            }}
          >
            <XCircle className="h-5 w-5" />
          </Box>
          <Box sx={{ textAlign: "end", flex: 1 }}>
            <Box sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
              {t("inactive")}
            </Box>
            <Box sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
              {types.filter((t) => !t.is_active).length}
            </Box>
          </Box>
        </Box>
      </Stack>

      <TableLayout
        filters={
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <TextField
                size="small"
                label={t("nameAr")}
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  params.setPage(1);
                }}
                sx={{ flex: 1, minWidth: 200 }}
              />
              <TextField
                select
                size="small"
                label={t("status")}
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  params.setPage(1);
                }}
                sx={{ flex: 1, minWidth: 200 }}
              >
                <MenuItem value="">{t("all")}</MenuItem>
                <MenuItem value="active">{t("isActive")}</MenuItem>
                <MenuItem value="inactive">{t("inactive")}</MenuItem>
              </TextField>
            </Stack>

            <TableLayout.TopActions
              state={state}
              customActions={
                permissions.canCreate ? (
                  <Button
                    variant="contained"
                    startIcon={<Plus className="w-4 h-4" />}
                    onClick={() => {
                      setEditType(undefined);
                      setDrawerOpen(true);
                    }}
                  >
                    {t("addType")}
                  </Button>
                ) : undefined
              }
            />
          </Stack>
        }
        table={<TableLayout.Table state={state} loadingOptions={{ rows: 5 }} />}
        pagination={<TableLayout.Pagination state={state} />}
      />

      <SiteStatusTypeDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditType(undefined);
        }}
        projectTypeId={projectTypeId}
        editType={editType}
      />

      <SiteStatusTypeKeysDrawer
        open={keysDrawerOpen}
        onClose={() => {
          setKeysDrawerOpen(false);
          setSelectedTypeForKeys(undefined);
        }}
        siteStatusType={selectedTypeForKeys}
        listParams={listParams}
      />

      <Dialog
        open={deleteTarget !== null}
        onClose={() => {
          if (deleteMutation.isPending) return;
          setDeleteTarget(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("deleteTypeTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t("deleteTypeBody")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleteMutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (deleteTarget) {
                deleteMutation.mutate(deleteTarget.id, {
                  onSuccess: () => {
                    setDeleteTarget(null);
                    toast.success(t("typeDeleted"));
                  },
                  onError: (error) => {
                    const err = error as {
                      response?: { data?: { message?: string } };
                    };
                    toast.error(
                      err?.response?.data?.message ?? t("typeDeleteError"),
                    );
                  },
                });
              }
            }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
