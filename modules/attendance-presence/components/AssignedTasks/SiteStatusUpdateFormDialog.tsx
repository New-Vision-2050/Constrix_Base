"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Camera, ClipboardList, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useSiteStatusUpdates } from "@/modules/projects/project/query/useProjectNotificationMutations";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationAvailableAction } from "@/services/api/projects/notifications/types/response";
import { useRequestSiteStatusUpdateMutation } from "../../hooks/useRequestSiteStatusUpdateMutation";
import {
  GeolocationRequestError,
  requestCurrentLocation,
} from "../../utils/geolocation";
import { useAttendanceDirection } from "../../utils/direction";
import AttendanceDialogShell from "../TodayLog/AttendanceDialogShell";
import {
  getDefaultDateValue,
  getDefaultTimeValue,
  getSiteStatusSelectFieldFromNotificationValues,
} from "./siteStatusUpdateFormUtils";

const DESCRIPTION_MAX_LENGTH = 500;

interface SiteStatusUpdateFormDialogProps {
  notification: ProjectNotification | null;
  action: ProjectNotificationAvailableAction | null;
  onClose: () => void;
}

interface PhotoPreview {
  file: File;
  url: string;
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <span>
      {children}
      <span className="text-destructive ms-0.5">*</span>
    </span>
  );
}

export default function SiteStatusUpdateFormDialog({
  notification,
  action,
  onClose,
}: SiteStatusUpdateFormDialogProps) {
  const t = useTranslations("AttendancePresence.assignedTasks.siteStatusUpdate");
  const tRoot = useTranslations("AttendancePresence");
  const { dir } = useAttendanceDirection();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateDate, setUpdateDate] = useState("");
  const [updateTime, setUpdateTime] = useState("");
  const [siteStatus, setSiteStatus] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const photosRef = useRef<PhotoPreview[]>([]);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const open = notification !== null && action !== null;
  const mutation = useRequestSiteStatusUpdateMutation(notification?.id ?? "");

  const {
    data: siteStatusUpdatesData,
    isLoading: isSiteStatusLoading,
    isError: isSiteStatusError,
  } = useSiteStatusUpdates(open ? notification?.id : undefined);

  const siteStatusField = useMemo(
    () =>
      getSiteStatusSelectFieldFromNotificationValues(
        siteStatusUpdatesData?.notification_values,
      ),
    [siteStatusUpdatesData?.notification_values],
  );

  const resetForm = useCallback(() => {
    const now = new Date();
    setUpdateDate(getDefaultDateValue(now));
    setUpdateTime(getDefaultTimeValue(now));
    setSiteStatus("");
    setDescription("");
    setPhotos((prev) => {
      prev.forEach((photo) => URL.revokeObjectURL(photo.url));
      return [];
    });
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
    if (!selected.length) return;

    setPhotos((prev) => [
      ...prev,
      ...selected.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
    event.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!notification || !action) return;

    if (!updateDate.trim() || !updateTime.trim()) {
      toast.error(t("dateTimeRequired"));
      return;
    }

    if (!isSiteStatusLoading && siteStatusField && !siteStatus.trim()) {
      toast.error(t("siteStatusRequired"));
      return;
    }

    if (!description.trim()) {
      toast.error(t("descriptionRequired"));
      return;
    }

    let location: { latitude: number; longitude: number };
    try {
      location = await ensureLocation();
    } catch (error) {
      toast.error(resolveLocationError(error));
      return;
    }

    try {
      await mutation.mutateAsync({
        description: description.trim(),
        internal_procedure_setting_id: action.id,
        files: photos.length > 0 ? photos.map((photo) => photo.file) : undefined,
        current_latitude: location.latitude,
        current_longitude: location.longitude,
        update_date: updateDate,
        update_time: updateTime,
        current_site_status_id: siteStatus || undefined,
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

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: "background.paper",
    },
  } as const;

  const readOnlyFieldSx = {
    ...fieldSx,
    "& .MuiOutlinedInput-root": {
      ...fieldSx["& .MuiOutlinedInput-root"],
      bgcolor: "action.hover",
    },
    "& .MuiInputBase-input": {
      cursor: "default",
    },
  } as const;

  const latitudeDisplay = isLocationLoading
    ? t("fetchingLocation")
    : latitude != null
      ? latitude.toFixed(6)
      : "—";

  const longitudeDisplay = isLocationLoading
    ? t("fetchingLocation")
    : longitude != null
      ? longitude.toFixed(6)
      : "—";

  return (
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t("updateInfoSection")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <ClipboardList size={18} />
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
            <TextField
              label={<RequiredLabel>{t("updateDateLabel")}</RequiredLabel>}
              type="date"
              value={updateDate}
              onChange={(event) => setUpdateDate(event.target.value)}
              fullWidth
              size="small"
              disabled={mutation.isPending}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
            <TextField
              label={<RequiredLabel>{t("updateTimeLabel")}</RequiredLabel>}
              type="time"
              value={updateTime}
              onChange={(event) => setUpdateTime(event.target.value)}
              fullWidth
              size="small"
              disabled={mutation.isPending}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
              inputProps={{ dir: "ltr" }}
            />
          </Box>

          {isSiteStatusError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t("siteStatusLoadError")}
            </Alert>
          ) : null}

          {isSiteStatusLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
                py: 1,
              }}
            >
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                {t("loadingSiteStatus")}
              </Typography>
            </Box>
          ) : null}

          {!isSiteStatusLoading && siteStatusField ? (
            <TextField
              select
              label={<RequiredLabel>{t("currentSiteStatusLabel")}</RequiredLabel>}
              value={siteStatus}
              onChange={(event) => setSiteStatus(event.target.value)}
              fullWidth
              size="small"
              disabled={mutation.isPending}
              SelectProps={{ displayEmpty: true }}
              sx={{ ...fieldSx, mb: 2 }}
            >
              <MenuItem value="" disabled>
                {t("selectSiteStatus")}
              </MenuItem>
              {siteStatusField.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          ) : null}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              {t("locationLabel")}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
              <TextField
                label={t("latitudeLabel")}
                value={latitudeDisplay}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
                sx={readOnlyFieldSx}
                inputProps={{ dir: "ltr" }}
              />
              <TextField
                label={t("longitudeLabel")}
                value={longitudeDisplay}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
                sx={readOnlyFieldSx}
                inputProps={{ dir: "ltr" }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
              <RequiredLabel>{t("descriptionLabel")}</RequiredLabel>
            </Typography>
            <TextField
              placeholder={t("descriptionPlaceholder")}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value.slice(0, DESCRIPTION_MAX_LENGTH))
              }
              multiline
              minRows={4}
              fullWidth
              disabled={mutation.isPending}
              sx={fieldSx}
            />
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 0.75, color: "text.secondary", textAlign: "start" }}
            >
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </Typography>
          </Box>

          <Box>
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
            </Box>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handlePhotosChange}
              disabled={mutation.isPending}
            />
          </Box>
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
              onClick={handleClose}
              disabled={mutation.isPending || isLocationLoading}
              sx={{ py: 1.25, borderRadius: 2, fontWeight: 700 }}
            >
              {tRoot("cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => void handleSubmit()}
              disabled={mutation.isPending || isLocationLoading}
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
                ? t("submitting")
                : isLocationLoading
                  ? t("fetchingLocation")
                  : t("saveUpdate")}
            </Button>
          </Box>
        </Box>
      </Box>
    </AttendanceDialogShell>
  );
}
