"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type { NotificationScope } from "@/modules/projects/project/utils/notificationScope";
import { useReassignProjectNotificationMutation } from "@/modules/projects/project/query/useProjectNotificationMutations";
import { useProjectNotificationEmployees } from "@/modules/projects/project/query/useProjectNotificationEmployees";
import { useProjectNotificationLocationPolygons } from "./wizard/useProjectNotificationLocationPolygons";
import { useGoogleRouteDistances } from "./wizard/useGoogleRouteDistances";
import ProjectNotificationMap from "./wizard/ProjectNotificationMap";

interface ReassignTaskModalProps {
  notification: ProjectNotification;
  scope: NotificationScope;
  open: boolean;
  onClose: () => void;
}

function getInitialSelectedUserIds(notification: ProjectNotification): string[] {
  const ids = new Set<string>();
  notification.assigned_users.forEach((u) => ids.add(u.id));
  if (notification.assigned_user?.id) ids.add(notification.assigned_user.id);
  if (notification.employee_task?.user?.id) ids.add(notification.employee_task.user.id);
  return Array.from(ids);
}

export default function ReassignTaskModal({
  notification,
  scope,
  open,
  onClose,
}: ReassignTaskModalProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const tCommon = useTranslations("common");

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(() =>
    getInitialSelectedUserIds(notification),
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedUserIds(getInitialSelectedUserIds(notification));
      setStatusFilter("");
      setNameFilter("");
      setBranchFilter("");
    }
  }, [open, notification]);

  const locationCenter = useMemo(
    () => ({
      lat: notification.task_latitude,
      lng: notification.task_longitude,
    }),
    [notification.task_latitude, notification.task_longitude],
  );

  const locationPolygons = useProjectNotificationLocationPolygons(
    !!(scope.projectId || scope.contractualEngagementKey),
  );

  const employeeQuery = useProjectNotificationEmployees({
    projectId: scope.projectId,
    contractualEngagementKey: scope.contractualEngagementKey,
    latitude: notification.task_latitude,
    longitude: notification.task_longitude,
    enabled: open,
  });

  const employees = useMemo(() => {
    const list = employeeQuery.data ?? [];
    return [...list].sort((a, b) => a.distance_meters - b.distance_meters);
  }, [employeeQuery.data]);

  const statusOptions = [
    { value: "", label: t("allStatuses", { defaultValue: "All statuses" }) },
    { value: "available", label: t("available", { defaultValue: "Available" }) },
    { value: "busy", label: t("busy", { defaultValue: "Busy" }) },
    { value: "no_location", label: t("noLocation", { defaultValue: "No Location" }) },
    { value: "offline", label: t("offline", { defaultValue: "Offline" }) },
  ];

  const branchOptions = useMemo(() => {
    const branches = new Set<string>();
    employees.forEach((e) => {
      if (e.branch) branches.add(e.branch);
    });
    return [
      { value: "", label: t("allBranches", { defaultValue: "All branches" }) },
      ...Array.from(branches).map((b) => ({ value: b, label: b })),
    ];
  }, [employees, t]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesStatus = !statusFilter || employee.status === statusFilter;
      const matchesName =
        !nameFilter || employee.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesBranch = !branchFilter || employee.branch === branchFilter;
      return matchesStatus && matchesName && matchesBranch;
    });
  }, [employees, statusFilter, nameFilter, branchFilter]);

  const routeDistances = useGoogleRouteDistances(filteredEmployees, locationCenter);

  const enrichedEmployees = useMemo(() => {
    return filteredEmployees.map((employee) => {
      const route = routeDistances[employee.user_id];
      return {
        ...employee,
        route_distance_meters: route?.distance.value ?? employee.distance_meters,
        route_distance_label: route?.distance.text ?? employee.distance_label,
        route_duration_text: route?.duration.text ?? "",
      };
    });
  }, [filteredEmployees, routeDistances]);

  const sortedEmployees = useMemo(() => {
    return [...enrichedEmployees].sort(
      (a, b) => a.route_distance_meters - b.route_distance_meters,
    );
  }, [enrichedEmployees]);

  const currentAssignedUserIds = useMemo(() => {
    return new Set(notification.assigned_users.map((u) => u.id));
  }, [notification.assigned_users]);

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const reassignMutation = useReassignProjectNotificationMutation(scope);

  const handleConfirm = () => {
    if (selectedUserIds.length === 0) {
      toast.error(
        t("reassignSelectUserError", { defaultValue: "Please select at least one employee" }),
      );
      return;
    }

    reassignMutation.mutate(
      { id: notification.id, assignedUserIds: selectedUserIds },
      {
        onSuccess: () => {
          toast.success(
            t("reassignSuccess", {
              defaultValue:
                "Task reassigned successfully. Selected employees can now confirm receipt to start their lifecycle.",
            }),
          );
          onClose();
        },
        onError: (error) => {
          const axiosError = error as {
            response?: { data?: { message?: string }; status?: number };
          };
          const status = axiosError?.response?.status;
          const message = axiosError?.response?.data?.message;
          if (status === 422) {
            toast.error(
              message ??
                t("reassignValidationError", {
                  defaultValue: "Please select at least one valid employee.",
                }),
            );
          } else if (status === 404) {
            toast.error(
              message ??
                t("reassignNotFoundError", { defaultValue: "Notification not found." }),
            );
          } else {
            toast.error(
              message ??
                t("reassignError", {
                  defaultValue:
                    "Could not reassign task. The linked task or selected employee may not exist.",
                }),
            );
          }
        },
      },
    );
  };

  const isBusy = reassignMutation.isPending || employeeQuery.isLoading;

  const statusColor = (status: string) => {
    switch (status) {
      case "available":
      case "available_far":
        return "#22c55e";
      case "busy":
        return "#f97316";
      case "no_location":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{t("reassignTask", { defaultValue: "Reassign Task" })}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ minHeight: 420 }}>
          <Grid size={{ xs: 12, md: 7 }} sx={{ height: { xs: 320, md: 460 } }}>
            <ProjectNotificationMap
              center={locationCenter}
              radius={notification.location_radius}
              employees={sortedEmployees}
              selectedUserIds={selectedUserIds}
              onSelectEmployee={toggleUser}
              height="100%"
              polygons={locationPolygons}
              showPolyline
              routeDistances={routeDistances}
              showPin
              showEmployees
              interactivePin={false}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} sx={{ height: { xs: "auto", md: 460 } }}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%", overflow: "auto" }}>
              <Typography variant="subtitle2" gutterBottom>
                {t("selectEmployees", { defaultValue: "Select employees" })}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  select
                  size="small"
                  label={t("filterByStatus")}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ minWidth: 130 }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  label={t("searchByName", { defaultValue: "Search by name" })}
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  sx={{ flex: 1 }}
                />

                {branchOptions.length > 1 && (
                  <TextField
                    select
                    size="small"
                    label={t("branch", { defaultValue: "Branch" })}
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    sx={{ minWidth: 130 }}
                  >
                    {branchOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {employeeQuery.isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2 }}>
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">{t("loading")}</Typography>
                </Box>
              ) : sortedEmployees.length === 0 ? (
                <Typography color="text.secondary">
                  {t("noEmployeesMatch", { defaultValue: "No employees match the filters" })}
                </Typography>
              ) : (
                <TableContainer component={Box} sx={{ border: "1px solid", borderColor: "divider" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "action.hover" }}>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          {t("assignment", { defaultValue: "Assign" })}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("employeeName", { defaultValue: "Employee name" })}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("employeeStatus", { defaultValue: "Status" })}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("routeDistance", { defaultValue: "Distance" })}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("estimatedDuration", { defaultValue: "Duration" })}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {t("currentLocation", { defaultValue: "Current location" })}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedEmployees.map((employee) => {
                        const isSelected = selectedUserIds.includes(employee.user_id);
                        const isCurrentlyAssigned = currentAssignedUserIds.has(employee.user_id);
                        const hasLocation =
                          employee.location?.latitude != null &&
                          employee.location?.longitude != null;
                        return (
                          <TableRow
                            key={employee.user_id}
                            onClick={() => toggleUser(employee.user_id)}
                            sx={{
                              cursor: "pointer",
                              bgcolor: isSelected ? "action.selected" : "background.paper",
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <TableCell align="center">
                              <Checkbox
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedUserIds((prev) => [...prev, employee.user_id]);
                                  } else {
                                    setSelectedUserIds((prev) =>
                                      prev.filter((id) => id !== employee.user_id),
                                    );
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {employee.name}
                              </Typography>
                              {employee.branch && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {employee.branch}
                                </Typography>
                              )}
                              {isCurrentlyAssigned && (
                                <Typography
                                  variant="caption"
                                  color="primary.main"
                                  fontWeight={600}
                                  display="block"
                                >
                                  {t("currentlyAssigned", { defaultValue: "Currently assigned" })}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    bgcolor: statusColor(employee.status),
                                  }}
                                />
                                <Typography variant="body2">{employee.status_label}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {employee.route_distance_label}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {employee.route_duration_text || "-"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {hasLocation ? (
                                <Typography variant="caption" color="text.secondary">
                                  {Number(employee.location?.latitude)?.toFixed(4)},{" "}
                                  {Number(employee.location?.longitude)?.toFixed(4)}
                                </Typography>
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  {t("noLocation", { defaultValue: "No location" })}
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={reassignMutation.isPending}>
          {tCommon("cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={selectedUserIds.length === 0 || isBusy}
          startIcon={reassignMutation.isPending ? <CircularProgress size={16} /> : null}
        >
          {t("confirmReassign", { defaultValue: "Confirm Reassign" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
