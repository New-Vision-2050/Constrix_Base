"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
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
import { formatDistanceMeters } from "@/modules/projects/project/utils/distanceFormat";

interface ReassignTaskModalProps {
  notification: ProjectNotification;
  scope: NotificationScope;
  open: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  available: "#22c55e",
  busy: "#f97316",
  offline: "#6b7280",
  no_location: "#ef4444",
  available_far: "#eab308",
};

function getInitialSelectedUserId(notification: ProjectNotification): string {
  if (notification.employee_task?.user?.id) {
    return notification.employee_task.user.id;
  }
  if (notification.assigned_user?.id) {
    return notification.assigned_user.id;
  }
  if (notification.assigned_users.length > 0) {
    return notification.assigned_users[0].id;
  }
  return "";
}

export default function ReassignTaskModal({
  notification,
  scope,
  open,
  onClose,
}: ReassignTaskModalProps) {
  const t = useTranslations("project.maintenanceEmergency.notifications");
  const tCommon = useTranslations("common");

  const [selectedUserId, setSelectedUserId] = useState<string>(() =>
    getInitialSelectedUserId(notification),
  );

  useEffect(() => {
    if (open) {
      setSelectedUserId(getInitialSelectedUserId(notification));
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

  const routeDistances = useGoogleRouteDistances(employees, locationCenter);

  const enrichedEmployees = useMemo(() => {
    return employees.map((employee) => {
      const route = routeDistances[employee.user_id];
      return {
        ...employee,
        route_distance_meters: route?.distance.value ?? employee.distance_meters,
        route_distance_label: route?.distance.text ?? employee.distance_label,
        route_duration_text: route?.duration.text ?? "",
      };
    });
  }, [employees, routeDistances]);

  const sortedEmployees = useMemo(() => {
    return [...enrichedEmployees].sort(
      (a, b) => a.route_distance_meters - b.route_distance_meters,
    );
  }, [enrichedEmployees]);

  const reassignMutation = useReassignProjectNotificationMutation(scope);

  const handleConfirm = () => {
    if (!selectedUserId) {
      toast.error(t("reassignSelectUserError", { defaultValue: "Please select an employee" }));
      return;
    }

    reassignMutation.mutate(
      { id: notification.id, userId: selectedUserId },
      {
        onSuccess: () => {
          toast.success(
            t("reassignSuccess", {
              defaultValue:
                "Task reassigned successfully. The employee can now confirm receipt to start a new lifecycle.",
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
                  defaultValue: "Invalid or missing employee selection.",
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
              selectedUserIds={[selectedUserId]}
              onSelectEmployee={(userId) => setSelectedUserId(userId)}
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
                {t("selectEmployee", { defaultValue: "Select employee" })}
              </Typography>
              {employeeQuery.isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2 }}>
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">{t("loading")}</Typography>
                </Box>
              ) : sortedEmployees.length === 0 ? (
                <Typography color="text.secondary">
                  {t("noEmployeesMatch", { defaultValue: "No employees found" })}
                </Typography>
              ) : (
                <RadioGroup
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <Stack spacing={1}>
                    {sortedEmployees.map((employee) => {
                      const isSelected = selectedUserId === employee.user_id;
                      const isCurrentTaskUser =
                        notification.employee_task?.user?.id === employee.user_id;
                      return (
                        <Paper
                          key={employee.user_id}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderColor: isSelected ? "primary.main" : "divider",
                            bgcolor: isSelected ? "action.selected" : "background.paper",
                            cursor: "pointer",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                          onClick={() => setSelectedUserId(employee.user_id)}
                        >
                          <FormControlLabel
                            value={employee.user_id}
                            control={<Radio />}
                            label={
                              <Stack spacing={0.5} sx={{ ml: 0.5 }}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  flexWrap="wrap"
                                >
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: "50%",
                                      bgcolor: statusColors[employee.status] ?? "#6b7280",
                                    }}
                                  />
                                  <Typography variant="body2" fontWeight={600}>
                                    {employee.name}
                                  </Typography>
                                  {isCurrentTaskUser && (
                                    <Typography
                                      variant="caption"
                                      color="primary.main"
                                      fontWeight={600}
                                    >
                                      {t("currentlyAssigned", {
                                        defaultValue: "Currently assigned",
                                      })}
                                    </Typography>
                                  )}
                                </Stack>
                                {employee.branch && (
                                  <Typography variant="caption" color="text.secondary">
                                    {employee.branch}
                                  </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary">
                                  {formatDistanceMeters(
                                    employee.route_distance_meters,
                                    t("meters"),
                                    t("kilometers"),
                                  )}
                                  {employee.route_duration_text
                                    ? ` · ${employee.route_duration_text}`
                                    : null}
                                </Typography>
                              </Stack>
                            }
                            sx={{ alignItems: "flex-start", m: 0 }}
                          />
                        </Paper>
                      );
                    })}
                  </Stack>
                </RadioGroup>
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
          disabled={!selectedUserId || isBusy}
          startIcon={reassignMutation.isPending ? <CircularProgress size={16} /> : null}
        >
          {t("confirmReassign", { defaultValue: "Confirm Reassign" })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
