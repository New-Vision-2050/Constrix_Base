"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ClipboardCheck, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationAvailableAction } from "@/services/api/projects/notifications/types/response";
import { useProjectViolationsCatalog } from "../../hooks/useProjectViolationsCatalog";
import { useSubmitSafetyViolationFormMutation } from "../../hooks/useSubmitSafetyViolationFormMutation";
import {
  GeolocationRequestError,
  requestCurrentLocation,
} from "../../utils/geolocation";
import { useAttendanceDirection } from "../../utils/direction";
import AttendanceDialogShell from "../TodayLog/AttendanceDialogShell";
import SafetyViolationFormItem from "./SafetyViolationFormItem";
import {
  createEmptySafetyViolationAnswer,
  getFirstIncompleteViolationIndex,
  isSafetyViolationAnswerComplete,
  parseViolationActionOptions,
  revokeSafetyViolationPhotos,
  type SafetyViolationAnswer,
  type SafetyViolationAnswerStatus,
  type ViolationActionOption,
} from "./safetyViolationFormUtils";

interface SafetyViolationFormDialogProps {
  notification: ProjectNotification | null;
  action: ProjectNotificationAvailableAction | null;
  onClose: () => void;
}

export default function SafetyViolationFormDialog({
  notification,
  action,
  onClose,
}: SafetyViolationFormDialogProps) {
  const t = useTranslations("AttendancePresence");
  const { dir } = useAttendanceDirection();

  const open = notification !== null && action !== null;
  const mutation = useSubmitSafetyViolationFormMutation(notification?.id ?? "");
  const {
    data: violations = [],
    isLoading,
    isError,
  } = useProjectViolationsCatalog(open);

  const [answers, setAnswers] = useState<Record<string, SafetyViolationAnswer>>(
    {},
  );
  const answersRef = useRef(answers);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const actionsByViolationId = useMemo(() => {
    return violations.reduce<Record<string, ViolationActionOption[]>>(
      (acc, violation) => {
        acc[violation.id] = parseViolationActionOptions(violation.actions);
        return acc;
      },
      {},
    );
  }, [violations]);

  const violationIds = useMemo(
    () => violations.map((violation) => violation.id),
    [violations],
  );

  const activeIndex = useMemo(
    () => getFirstIncompleteViolationIndex(violationIds, answers),
    [violationIds, answers],
  );

  const completedCount = useMemo(
    () =>
      violationIds.filter((id) =>
        isSafetyViolationAnswerComplete(
          answers[id] ?? createEmptySafetyViolationAnswer(),
        ),
      ).length,
    [violationIds, answers],
  );

  const allComplete =
    violationIds.length > 0 && completedCount === violationIds.length;

  const resetForm = useCallback(() => {
    Object.values(answersRef.current).forEach((answer) => {
      revokeSafetyViolationPhotos(answer.photos);
    });
    setAnswers({});
    setLatitude(undefined);
    setLongitude(undefined);
    setIsLocationLoading(false);
  }, []);

  const resolveLocationError = useCallback(
    (error: unknown) => {
      if (error instanceof GeolocationRequestError) {
        if (error.code === "PERMISSION_DENIED") {
          return t("assignedTasks.safetyViolationForm.locationPermissionDenied");
        }
      }
      return t("assignedTasks.safetyViolationForm.locationUnavailable");
    },
    [t],
  );

  const fetchLocation = useCallback(async () => {
    setIsLocationLoading(true);
    try {
      const position = await requestCurrentLocation();
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error) {
      setLatitude(undefined);
      setLongitude(undefined);
      throw error;
    } finally {
      setIsLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }
    resetForm();
    void fetchLocation();
  }, [open, resetForm, fetchLocation]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(
    () => () => {
      Object.values(answersRef.current).forEach((answer) => {
        revokeSafetyViolationPhotos(answer.photos);
      });
    },
    [],
  );

  const updateAnswer = (
    violationId: string,
    updater: (current: SafetyViolationAnswer) => SafetyViolationAnswer,
  ) => {
    setAnswers((prev) => {
      const current = prev[violationId] ?? createEmptySafetyViolationAnswer();
      const next = updater(current);
      return { ...prev, [violationId]: next };
    });
  };

  const handleStatusChange = (
    violationId: string,
    status: SafetyViolationAnswerStatus,
  ) => {
    updateAnswer(violationId, (current) => {
      revokeSafetyViolationPhotos(current.photos);
      return {
        status,
        photos: [],
      };
    });
  };

  const handleAddPhotos = (violationId: string, files: File[]) => {
    updateAnswer(violationId, (current) => ({
      ...current,
      photos: [
        ...current.photos,
        ...files.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        })),
      ],
    }));
  };

  const handleRemovePhoto = (violationId: string, photoIndex: number) => {
    updateAnswer(violationId, (current) => {
      const nextPhotos = [...current.photos];
      const [removed] = nextPhotos.splice(photoIndex, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return { ...current, photos: nextPhotos };
    });
  };

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!notification || !action || !allComplete) return;

    let location: { latitude: number; longitude: number } | undefined;
    try {
      if (latitude != null && longitude != null) {
        location = { latitude, longitude };
      } else {
        location = await fetchLocation();
      }
    } catch (error) {
      toast.error(resolveLocationError(error));
      return;
    }

    try {
      await mutation.mutateAsync({
        internal_procedure_setting_id: action.id,
        current_latitude: location.latitude,
        current_longitude: location.longitude,
        violations: violations.map((violation) => {
          const answer = answers[violation.id] ?? createEmptySafetyViolationAnswer();
          return {
            violation_id: violation.id,
            status: answer.status!,
            images:
              answer.status === "violation_found"
                ? answer.photos.map((photo) => photo.file)
                : undefined,
          };
        }),
      });
      toast.success(t("assignedTasks.safetyViolationForm.submitSuccess"));
      onClose();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (error as { response: { data: { message: string } } }).response.data
              .message
          : t("assignedTasks.safetyViolationForm.submitError");
      toast.error(message);
    }
  };

  return (
    <AttendanceDialogShell
      open={open}
      onClose={handleClose}
      title={t("assignedTasks.safetyViolationForm.title")}
      className="max-w-2xl p-0 max-h-[92vh] overflow-hidden flex flex-col"
    >
      <Box
        dir={dir}
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
          minHeight: 0,
        }}
      >
        <Box sx={{ flexShrink: 0, px: { xs: 2, sm: 3 }, pt: 1, pb: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                mb: 1.5,
              }}
            >
              <ClipboardCheck size={24} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
              {t("assignedTasks.safetyViolationForm.title")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
              {t("assignedTasks.safetyViolationForm.subtitle")}
            </Typography>
            {notification?.notification_number ? (
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.75, fontWeight: 700, color: "text.primary" }}
              >
                {notification.notification_number}
              </Typography>
            ) : null}
            {violations.length > 0 ? (
              <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
                {t("assignedTasks.safetyViolationForm.progressSummary", {
                  total: violations.length,
                  completed: completedCount,
                  remaining: violations.length - completedCount,
                })}
              </Typography>
            ) : null}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: { xs: 2, sm: 3 },
            pb: 2,
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : null}

          {isError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t("assignedTasks.safetyViolationForm.loadError")}
            </Alert>
          ) : null}

          {!isLoading && !isError && violations.length === 0 ? (
            <Alert severity="info">{t("assignedTasks.safetyViolationForm.emptyCatalog")}</Alert>
          ) : null}

          {!isLoading && violations.length > 0 ? (
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {violations.map((violation, index) => {
                const answer = answers[violation.id] ?? createEmptySafetyViolationAnswer();
                const isActive = index === activeIndex;
                const isLocked = index > activeIndex;

                return (
                  <SafetyViolationFormItem
                    key={violation.id}
                    index={index}
                    violation={violation}
                    answer={answer}
                    actionOptions={actionsByViolationId[violation.id] ?? []}
                    isActive={isActive}
                    isLocked={isLocked}
                    disabled={mutation.isPending || isLocked}
                    onStatusChange={(status) =>
                      handleStatusChange(violation.id, status)
                    }
                    onAddPhotos={(files) => handleAddPhotos(violation.id, files)}
                    onRemovePhoto={(photoIndex) =>
                      handleRemovePhoto(violation.id, photoIndex)
                    }
                  />
                );
              })}
            </Box>
          ) : null}
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            px: { xs: 2, sm: 3 },
            pb: 3,
            pt: 1.5,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClose}
              disabled={mutation.isPending || isLocationLoading}
              sx={{ py: 1.25, borderRadius: 2, fontWeight: 700 }}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => void handleSubmit()}
              disabled={
                mutation.isPending ||
                isLocationLoading ||
                isLoading ||
                !allComplete
              }
              startIcon={
                mutation.isPending || isLocationLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Save size={16} />
                )
              }
              sx={{ py: 1.25, borderRadius: 2, fontWeight: 700 }}
            >
              {mutation.isPending
                ? t("assignedTasks.safetyViolationForm.submitting")
                : isLocationLoading
                  ? t("assignedTasks.safetyViolationForm.fetchingLocation")
                  : t("assignedTasks.safetyViolationForm.submitReport")}
            </Button>
          </Box>
        </Box>
      </Box>
    </AttendanceDialogShell>
  );
}
