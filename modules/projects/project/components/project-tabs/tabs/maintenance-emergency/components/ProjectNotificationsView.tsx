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
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Eye, FileDown, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import I18nLink from "@i18n/link";
import { ROUTER } from "@/router";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectMyPermissionsFlat } from "@/modules/projects/project/query/useProjectMyPermissionsFlat";
import {
  useProjectNotifications,
  projectNotificationsQueryKey,
} from "@/modules/projects/project/query/useProjectNotifications";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import {
  PROJECT_NOTIFICATION_APPROVE,
  PROJECT_NOTIFICATION_CREATE,
  PROJECT_NOTIFICATION_DELETE,
  PROJECT_NOTIFICATION_EXPORT,
  PROJECT_NOTIFICATION_LIST,
  PROJECT_NOTIFICATION_REJECT,
  PROJECT_NOTIFICATION_UPDATE,
  PROJECT_NOTIFICATION_VIEW,
} from "@/modules/projects/project/constants/projectPermissionKeys";
import {
  hasAnyProjectPermissionKey,
  hasProjectPermissionKey,
} from "@/modules/projects/project/utils/projectMyPermissions";
import { isNotificationActionable } from "@/modules/projects/project/utils/notificationStatusConfig";
import { formatDistanceMeters } from "@/modules/projects/project/utils/distanceFormat";
import NotificationStatusBadge from "./NotificationStatusBadge";
import NotificationSeverityBadge from "./NotificationSeverityBadge";
import CreateNotificationWizard from "./wizard/CreateNotificationWizard";

const TableLayout = HeadlessTableLayout<ProjectNotification>(
  "project-notifications-table",
);

const filterSx = {
  flex: 1,
  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
} as const;

const STATUS_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "pending", labelKey: "statuses.pending" },
  { value: "approved", labelKey: "statuses.approved" },
  { value: "rejected", labelKey: "statuses.rejected" },
  { value: "in_progress", labelKey: "statuses.inProgress" },
  { value: "completed", labelKey: "statuses.completed" },
  { value: "cancelled", labelKey: "statuses.cancelled" },
];
const SEVERITY_OPTIONS = ["low", "medium", "high", "critical"];
const TYPE_OPTIONS = ["maintenance", "emergency", "violation", "inspection"];
const WORK_TYPE_OPTIONS = ["electrical", "mechanical", "civil", "finishing", "landscaping"];

export default function ProjectNotificationsView() {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const tCommon = useTranslations("common");
  const { projectId } = useProject();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterWorkType, setFilterWorkType] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterAssignedUser, setFilterAssignedUser] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ProjectNotification | null>(null);
  const [viewTarget, setViewTarget] = useState<ProjectNotification | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<"create" | "edit">("create");
  const [editTargetId, setEditTargetId] = useState<string | null>(null);

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
  const canCreate = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_NOTIFICATION_CREATE),
    [flatPerms],
  );
  const canUpdate = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_NOTIFICATION_UPDATE),
    [flatPerms],
  );
  const canDelete = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_NOTIFICATION_DELETE),
    [flatPerms],
  );
  const canExport = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_NOTIFICATION_EXPORT),
    [flatPerms],
  );
  const canApprove = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_NOTIFICATION_APPROVE),
    [flatPerms],
  );
  const canReject = useMemo(
    () => hasProjectPermissionKey(flatPerms, PROJECT_NOTIFICATION_REJECT),
    [flatPerms],
  );

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const { data: queryResult, isLoading } = useProjectNotifications({
    projectId,
    page: params.page,
    perPage: params.limit,
    status: filterStatus || undefined,
    severity: filterSeverity || undefined,
    notificationType: filterType || undefined,
    workType: filterWorkType || undefined,
    fromDate: filterFromDate || undefined,
    toDate: filterToDate || undefined,
    assignedUserId: filterAssignedUser || undefined,
    search: params.search || undefined,
  });

  const data = useMemo(() => queryResult?.data ?? [], [queryResult]);
  const totalPages = queryResult?.pagination?.last_page ?? 1;
  const totalItems = queryResult?.pagination?.result_count ?? data.length;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProjectNotificationsApi.delete(id),
    onSuccess: () => {
      setDeleteTarget(null);
      toast.success(t("deleteSuccess"));
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectNotificationsQueryKey({ projectId }),
        });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? t("deleteError"));
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => ProjectNotificationsApi.approve(id),
    onSuccess: () => {
      toast.success(t("approveSuccess"));
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectNotificationsQueryKey({ projectId }),
        });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? t("approveError"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      ProjectNotificationsApi.reject(id, { rejection_reason: "" }),
    onSuccess: () => {
      toast.success(t("rejectSuccess"));
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectNotificationsQueryKey({ projectId }),
        });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? t("rejectError"));
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await ProjectNotificationsApi.export({
        project_id: projectId!,
        status: filterStatus || undefined,
        severity: filterSeverity || undefined,
        notification_type: filterType || undefined,
        work_type: filterWorkType || undefined,
        from_date: filterFromDate || undefined,
        to_date: filterToDate || undefined,
        assigned_user_id: filterAssignedUser || undefined,
        search: params.search || undefined,
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `notifications-${projectId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? tCommon("states.error"));
    },
  });

  const columns = useMemo(
    () => [
      {
        key: "notification_number",
        name: t("notificationNumber"),
        sortable: false,
        render: (row: ProjectNotification) =>
          row.notification_number ? (
            <I18nLink
              href={ROUTER.PROJECT_NOTIFICATION_DETAILS(
                projectId,
                row.id,
              )}
              className="p-2 text-sm text-primary hover:underline"
            >
              {row.notification_number}
            </I18nLink>
          ) : (
            <span className="p-2 text-sm">—</span>
          ),
      },
      {
        key: "status",
        name: t("status"),
        sortable: false,
        render: (row: ProjectNotification) => (
          <NotificationStatusBadge status={row.status} />
        ),
      },
      {
        key: "severity",
        name: t("severity"),
        sortable: false,
        render: (row: ProjectNotification) => (
          <NotificationSeverityBadge severity={row.severity} />
        ),
      },
      {
        key: "notification_type",
        name: t("type"),
        sortable: false,
        render: (row: ProjectNotification) => <span>{row.notification_type}</span>,
      },
      {
        key: "work_type",
        name: t("workType"),
        sortable: false,
        render: (row: ProjectNotification) => <span>{row.work_type}</span>,
      },
      {
        key: "contractor",
        name: t("contractor"),
        sortable: false,
        render: (row: ProjectNotification) => <span>{row.contractor_name}</span>,
      },
      {
        key: "engineer",
        name: t("engineer"),
        sortable: false,
        render: (row: ProjectNotification) => (
          <span>{row.assigned_user?.name ?? "—"}</span>
        ),
      },
      {
        key: "distance",
        name: t("distance"),
        sortable: false,
        render: (row: ProjectNotification) => (
          <span>
            {formatDistanceMeters(
              row.selected_distance_meters,
              t("meters"),
              t("kilometers"),
            )}
          </span>
        ),
      },
      {
        key: "location",
        name: t("location"),
        sortable: false,
        render: (row: ProjectNotification) => <span>{row.repair_point}</span>,
      },
      {
        key: "date",
        name: t("date"),
        sortable: false,
        render: (row: ProjectNotification) => <span>{row.task_date}</span>,
      },
      {
        key: "actions",
        name: t("columnActions"),
        sortable: false,
        render: (row: ProjectNotification) => {
          const actionable = isNotificationActionable(row.status);
          return (
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
              <MenuItem onClick={() => setViewTarget(row)}>
                <Eye className="w-4 h-4 me-2" />
                {t("view")}
              </MenuItem>
              {actionable && canUpdate ? (
                <MenuItem
                  onClick={() => {
                    setWizardMode("edit");
                    setEditTargetId(row.id);
                    setWizardOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4 me-2" />
                  {t("edit")}
                </MenuItem>
              ) : null}
              {actionable && canApprove ? (
                <MenuItem
                  onClick={() => approveMutation.mutate(row.id)}
                  disabled={approveMutation.isPending}
                >
                  {t("approve")}
                </MenuItem>
              ) : null}
              {actionable && canReject ? (
                <MenuItem
                  onClick={() => rejectMutation.mutate(row.id)}
                  disabled={rejectMutation.isPending}
                  sx={{ color: "error.main" }}
                >
                  {t("reject")}
                </MenuItem>
              ) : null}
              {actionable && canDelete ? (
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(row);
                  }}
                  disabled={deleteMutation.isPending}
                  sx={{ color: "error.main" }}
                >
                  <Trash2 className="w-4 h-4 me-2" />
                  {t("delete")}
                </MenuItem>
              ) : null}
            </CustomMenu>
          );
        },
      },
    ],
    [
      t,
      projectId,
      canUpdate,
      canDelete,
      canApprove,
      canReject,
      approveMutation.isPending,
      rejectMutation.isPending,
      deleteMutation.isPending,
    ],
  );

  const state = TableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ProjectNotification) => row.id,
    loading: isLoading,
    searchable: true,
  });

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

  const handleClearFilters = () => {
    setFilterStatus("");
    setFilterSeverity("");
    setFilterType("");
    setFilterWorkType("");
    setFilterFromDate("");
    setFilterToDate("");
    setFilterAssignedUser("");
    params.setPage(1);
    params.setSearch("");
  };

  return (
    <>
      <Box>
        <TableLayout
          filters={
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <TextField
                  select
                  size="small"
                  label={t("status")}
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    params.setPage(1);
                  }}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label={t("severity")}
                  value={filterSeverity}
                  onChange={(e) => {
                    setFilterSeverity(e.target.value);
                    params.setPage(1);
                  }}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  {SEVERITY_OPTIONS.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`severities.${value}`)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label={t("type")}
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    params.setPage(1);
                  }}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  {TYPE_OPTIONS.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`types.${value}`)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  size="small"
                  label={t("workType")}
                  value={filterWorkType}
                  onChange={(e) => {
                    setFilterWorkType(e.target.value);
                    params.setPage(1);
                  }}
                  sx={filterSx}
                >
                  <MenuItem value="">{t("all")}</MenuItem>
                  {WORK_TYPE_OPTIONS.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`workTypes.${value}`)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  label={t("fromDate")}
                  type="date"
                  value={filterFromDate}
                  onChange={(e) => {
                    setFilterFromDate(e.target.value);
                    params.setPage(1);
                  }}
                  InputLabelProps={{ shrink: true }}
                  sx={filterSx}
                />

                <TextField
                  size="small"
                  label={t("toDate")}
                  type="date"
                  value={filterToDate}
                  onChange={(e) => {
                    setFilterToDate(e.target.value);
                    params.setPage(1);
                  }}
                  InputLabelProps={{ shrink: true }}
                  sx={filterSx}
                />

                <TextField
                  size="small"
                  label={t("engineer")}
                  value={filterAssignedUser}
                  onChange={(e) => {
                    setFilterAssignedUser(e.target.value);
                    params.setPage(1);
                  }}
                  sx={filterSx}
                />
              </Stack>

              <TableLayout.TopActions
                state={state}
                customActions={
                  <Stack direction="row" spacing={1}>
                    {canCreate ? (
                      <Button
                        variant="contained"
                        startIcon={<Plus />}
                        onClick={() => {
                          setWizardMode("create");
                          setEditTargetId(null);
                          setWizardOpen(true);
                        }}
                      >
                        {t("addNotification")}
                      </Button>
                    ) : null}
                    {canExport ? (
                      <Button
                        variant="outlined"
                        startIcon={<FileDown />}
                        onClick={() => exportMutation.mutate()}
                        disabled={exportMutation.isPending}
                      >
                        {t("export")}
                      </Button>
                    ) : null}
                    <Button variant="outlined" onClick={handleClearFilters}>
                      {t("clearFilters")}
                    </Button>
                  </Stack>
                }
              />
            </Stack>
          }
          table={
            <TableLayout.Table state={state} loadingOptions={{ rows: 5 }} />
          }
          pagination={<TableLayout.Pagination state={state} />}
        />
      </Box>

      <CreateNotificationWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        mode={wizardMode}
        notificationId={editTargetId}
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
        <DialogTitle>{t("deleteNotification")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t("deleteConfirm")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleteMutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (deleteTarget) {
                deleteMutation.mutate(deleteTarget.id);
              }
            }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewTarget !== null}
        onClose={() => setViewTarget(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t("viewNotification")}</DialogTitle>
        <DialogContent dividers>
          {viewTarget && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("notificationNumber")}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {viewTarget.notification_number ?? "-"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("status")}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <NotificationStatusBadge status={viewTarget.status} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("type")}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {viewTarget.notification_type}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("severity")}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <NotificationSeverityBadge severity={viewTarget.severity} />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("contractor")}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {viewTarget.contractor_name}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("engineer")}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {viewTarget.assigned_user?.name ?? "-"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("description")}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {viewTarget.work_description}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  {t("location")}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {viewTarget.repair_point}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewTarget(null)}>{tCommon("close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
