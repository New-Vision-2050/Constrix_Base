"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Camera, CheckCircle2, Info, Paperclip, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationAvailableAction } from "@/services/api/projects/notifications/types/response";
import { useEndTaskMutation } from "../../hooks/useEndTaskMutation";
import { useEndTaskStatuses } from "../../hooks/useEndTaskStatuses";
import {
  GeolocationRequestError,
  requestCurrentLocation,
} from "../../utils/geolocation";
import { useAttendanceDirection } from "../../utils/direction";
import AttendanceDialogShell from "../TodayLog/AttendanceDialogShell";
import {
  END_TASK_NOTES_MAX_LENGTH,
  END_TASK_SCREENSHOT_MAX_BYTES,
  END_TASK_SCREENSHOT_SLOTS,
  getEndTaskStatusLabel,
} from "./endTaskFormUtils";

interface EndTaskFormDialogProps {
  notification: ProjectNotification | null;
  action: ProjectNotificationAvailableAction | null;
  onClose: () => void;
}

interface PhotoPreview {
  file: File;
  url: string;
}

export default function EndTaskFormDialog({
  notification,
  action,
  onClose,
}: EndTaskFormDialogProps) {
  const t = useTranslations("AttendancePresence.assignedTasks.endTask");
  const tRoot = useTranslations("AttendancePresence");
  const locale = useLocale();
  const { dir } = useAttendanceDirection();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [statusId, setStatusId] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const photosRef = useRef(photos);
  const [statementsSent, setStatementsSent] = useState(false);
  const [attachmentsReviewed, setAttachmentsReviewed] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const open = notification !== null && action !== null;
  const mutation = useEndTaskMutation(notification?.id ?? "");
  const {
    data: endTaskStatuses = [],
    isLoading: isStatusesLoading,
    isError: isStatusesError,
  } = useEndTaskStatuses(open);

  const selectedStatus = useMemo(
    () => endTaskStatuses.find((status) => status.id === statusId) ?? null,
    [endTaskStatuses, statusId],
  );

  const resetForm = useCallback(() => {
    setStatusId("");
    setNotes("");
    setPhotos((prev) => {
      prev.forEach((photo) => URL.revokeObjectURL(photo.url));
      return [];
    });
    setStatementsSent(false);
    setAttachmentsReviewed(false);
    setPreviewOpen(false);
    setLatitude(undefined);
    setLongitude(undefined);
    setIsLocationLoading(false);
  }, []);

  const resolveLocationError = useCallback(
    (error: unknown) => {
      if (error instanceof GeolocationRequestError) {
        if (error.code === "PERMISSION_DENIED") {
          return t("locationPermissionDenied");
        }
      }
      return t("locationUnavailable");
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

  const ensureLocation = useCallback(async () => {
    if (latitude != null && longitude != null) {
      return { latitude, longitude };
    }
    return fetchLocation();
  }, [latitude, longitude, fetchLocation]);

  useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }
    resetForm();
    void fetchLocation();
  }, [open, resetForm, fetchLocation]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    },
    [],
  );

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  const handlePhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;

    const validFiles: File[] = [];
    for (const file of selected) {
      if (file.size > END_TASK_SCREENSHOT_MAX_BYTES) {
        toast.error(t("screenshotTooLarge"));
        continue;
      }
      validFiles.push(file);
    }
    if (!validFiles.length) return;

    setPhotos((prev) => {
      const remaining = END_TASK_SCREENSHOT_SLOTS - prev.length;
      const toAdd = validFiles.slice(0, remaining).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...toAdd];
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  const validateForm = () => {
    if (!statusId) {
      toast.error(t("statusRequired"));
      return false;
    }
    if (photos.length === 0) {
      toast.error(t("screenshotsRequired"));
      return false;
    }
    if (!statementsSent || !attachmentsReviewed) {
      toast.error(t("confirmationsRequired"));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!notification || !action) return;
    if (!validateForm()) return;

    let location: { latitude: number; longitude: number };
    try {
      location = await ensureLocation();
    } catch (error) {
      toast.error(resolveLocationError(error));
      return;
    }

    try {
      await mutation.mutateAsync({
        status_id: statusId,
        latitude: location.latitude,
        longitude: location.longitude,
        notes: notes.trim() || undefined,
        internal_procedure_setting_id: action.id,
        files: photos.map((photo) => photo.file),
      });
      toast.success(t("submitSuccess"));
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
          : t("submitError");
      toast.error(message);
    }
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    setPreviewOpen(true);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: "background.paper",
    },
  } as const;

  const isSubmitDisabled =
    mutation.isPending ||
    isLocationLoading ||
    isStatusesLoading ||
    isStatusesError;

  return (
    <>
      <AttendanceDialogShell
        open={open}
        onClose={handleClose}
        title={t("title")}
        className="max-w-lg p-0 max-h-[90vh] overflow-hidden flex flex-col"
      >
        <Box
          dir={dir}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "90vh",
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              px: { xs: 2, sm: 3 },
              pt: 1,
              pb: 2,
            }}
          >
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
                <CheckCircle2 size={24} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
                {t("title")}
              </Typography>
              {notification?.notification_number ? (
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 0.75, fontWeight: 700, color: "text.primary" }}
                >
                  {notification.notification_number}
                </Typography>
              ) : null}
              <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                {t("subtitle")}
              </Typography>
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
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: "background.paper",
                p: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                <Paperclip size={18} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t("attachClosingStatementsSection")}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                {t("attachClosingStatementsHint")}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
                  {t("endTaskStatusLabel")}
                </Typography>
                <TextField
                  select
                  value={statusId}
                  onChange={(event) => setStatusId(event.target.value)}
                  fullWidth
                  size="small"
                  disabled={mutation.isPending || isStatusesLoading || isStatusesError}
                  SelectProps={{ displayEmpty: true }}
                  sx={fieldSx}
                >
                  <MenuItem value="" disabled>
                    <Typography component="span" sx={{ color: "text.secondary" }}>
                      {t("selectEndTaskStatus")}
                    </Typography>
                  </MenuItem>
                  {endTaskStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {getEndTaskStatusLabel(status, locale)}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {isStatusesError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {t("statusesLoadError")}
                </Alert>
              ) : null}

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  {t("photosLabel")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  {photos.map((photo, index) => (
                    <Box
                      key={`${photo.file.name}-${index}`}
                      sx={{
                        position: "relative",
                        width: 88,
                        height: 88,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.file.name}
                        className="h-full w-full object-cover"
                      />
                      <IconButton
                        size="small"
                        onClick={() => removePhoto(index)}
                        disabled={mutation.isPending}
                        sx={{
                          position: "absolute",
                          top: 4,
                          insetInlineEnd: 4,
                          bgcolor: "rgba(0,0,0,0.55)",
                          color: "common.white",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                          width: 22,
                          height: 22,
                        }}
                      >
                        <X size={12} />
                      </IconButton>
                    </Box>
                  ))}

                  {photos.length < END_TASK_SCREENSHOT_SLOTS ? (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={mutation.isPending}
                      sx={{
                        width: 88,
                        height: 88,
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                        color: "primary.main",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        cursor: mutation.isPending ? "not-allowed" : "pointer",
                        opacity: mutation.isPending ? 0.6 : 1,
                      }}
                    >
                      <Camera size={22} />
                      <Typography variant="caption" sx={{ fontWeight: 600, px: 0.5 }}>
                        {t("addPhotos")}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotosChange}
                  disabled={mutation.isPending}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
                  {t("notesLabel")}
                </Typography>
                <TextField
                  placeholder={t("notesPlaceholder")}
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value.slice(0, END_TASK_NOTES_MAX_LENGTH))
                  }
                  multiline
                  minRows={4}
                  fullWidth
                  disabled={mutation.isPending}
                  sx={fieldSx}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.75,
                    color: "text.secondary",
                    textAlign: "start",
                  }}
                >
                  {notes.length}/{END_TASK_NOTES_MAX_LENGTH}
                </Typography>
              </Box>

              <Box sx={{ display: "grid", gap: 0.5, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={statementsSent}
                      onChange={(event) => setStatementsSent(event.target.checked)}
                      disabled={mutation.isPending}
                    />
                  }
                  label={t("statementsSentToGroups")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attachmentsReviewed}
                      onChange={(event) =>
                        setAttachmentsReviewed(event.target.checked)
                      }
                      disabled={mutation.isPending}
                    />
                  }
                  label={t("attachmentsReviewed")}
                />
              </Box>

              <Alert
                severity="info"
                icon={<Info size={18} />}
                sx={{ borderRadius: 2 }}
              >
                {t("screenshotsMandatoryInfo")}
              </Alert>
            </Box>
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handlePreview}
                disabled={isSubmitDisabled}
                sx={{ py: 1.25, borderRadius: 2, fontWeight: 700 }}
              >
                {t("preview")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => void handleSubmit()}
                disabled={isSubmitDisabled}
                startIcon={
                  mutation.isPending || isLocationLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )
                }
                sx={{ py: 1.25, borderRadius: 2, fontWeight: 700 }}
              >
                {mutation.isPending
                  ? t("submitting")
                  : isLocationLoading
                    ? t("fetchingLocation")
                    : t("closeNotification")}
              </Button>
            </Box>
          </Box>
        </Box>
      </AttendanceDialogShell>

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t("previewTitle")}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("endTaskStatusLabel")}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {selectedStatus
                  ? getEndTaskStatusLabel(selectedStatus, locale)
                  : "—"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("notesLabel")}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {notes.trim() || "—"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("screenshotsCount")}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {photos.length}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>{tRoot("cancel")}</Button>
          <Button
            variant="contained"
            onClick={() => {
              setPreviewOpen(false);
              void handleSubmit();
            }}
            disabled={mutation.isPending}
          >
            {t("closeNotification")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
