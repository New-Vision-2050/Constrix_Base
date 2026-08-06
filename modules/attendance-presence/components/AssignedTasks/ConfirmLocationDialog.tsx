"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationAvailableAction } from "@/services/api/projects/notifications/types/response";
import { useConfirmLocationMutation } from "../../hooks/useConfirmLocationMutation";
import {
  GeolocationRequestError,
  requestCurrentLocation,
} from "../../utils/geolocation";
import { useAttendanceDirection } from "../../utils/direction";
import AttendanceDialogShell from "../TodayLog/AttendanceDialogShell";
import { computeConfirmLocationMetrics } from "./confirmLocationUtils";

interface ConfirmLocationDialogProps {
  notification: ProjectNotification | null;
  action: ProjectNotificationAvailableAction | null;
  onClose: () => void;
}

export default function ConfirmLocationDialog({
  notification,
  action,
  onClose,
}: ConfirmLocationDialogProps) {
  const t = useTranslations("AttendancePresence.assignedTasks.confirmLocation");
  const tRoot = useTranslations("AttendancePresence");
  const { dir } = useAttendanceDirection();

  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [distanceMeters, setDistanceMeters] = useState<number | undefined>();
  const [isInsideLocation, setIsInsideLocation] = useState<0 | 1 | undefined>();
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const open = notification !== null && action !== null;
  const mutation = useConfirmLocationMutation(notification?.id ?? "");

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

  const applyLocationMetrics = useCallback(
    (userLatitude: number, userLongitude: number) => {
      if (!notification) {
        setDistanceMeters(undefined);
        setIsInsideLocation(undefined);
        return;
      }

      const metrics = computeConfirmLocationMetrics(
        userLatitude,
        userLongitude,
        notification,
      );
      setDistanceMeters(metrics.distance_meters);
      setIsInsideLocation(metrics.is_inside_location);
    },
    [notification],
  );

  const fetchLocation = useCallback(async () => {
    setIsLocationLoading(true);
    try {
      const position = await requestCurrentLocation();
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;
      setLatitude(userLatitude);
      setLongitude(userLongitude);
      applyLocationMetrics(userLatitude, userLongitude);
      return {
        latitude: userLatitude,
        longitude: userLongitude,
      };
    } catch (error) {
      setLatitude(undefined);
      setLongitude(undefined);
      setDistanceMeters(undefined);
      setIsInsideLocation(undefined);
      throw error;
    } finally {
      setIsLocationLoading(false);
    }
  }, [applyLocationMetrics]);

  const ensureLocation = useCallback(async () => {
    if (latitude != null && longitude != null) {
      return { latitude, longitude };
    }
    return fetchLocation();
  }, [latitude, longitude, fetchLocation]);

  useEffect(() => {
    if (!open) {
      setLatitude(undefined);
      setLongitude(undefined);
      setDistanceMeters(undefined);
      setIsInsideLocation(undefined);
      setIsLocationLoading(false);
      return;
    }
    void fetchLocation();
  }, [open, fetchLocation]);

  const handleClose = () => {
    if (mutation.isPending) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!notification || !action) return;

    let location: { latitude: number; longitude: number };
    try {
      location = await ensureLocation();
    } catch (error) {
      toast.error(resolveLocationError(error));
      return;
    }

    try {
      const metrics = computeConfirmLocationMetrics(
        location.latitude,
        location.longitude,
        notification,
      );

      await mutation.mutateAsync({
        latitude: location.latitude,
        longitude: location.longitude,
        distance_meters: metrics.distance_meters,
        is_inside_location: metrics.is_inside_location,
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

  const readOnlyFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
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

  const distanceDisplay =
    isLocationLoading || distanceMeters == null ? "—" : String(distanceMeters);

  const insideLocationDisplay =
    isLocationLoading || isInsideLocation == null
      ? "—"
      : isInsideLocation === 1
        ? t("insideLocationYes")
        : t("insideLocationNo");

  return (
    <AttendanceDialogShell
      open={open}
      onClose={handleClose}
      title={t("title")}
      className="max-w-md p-0"
    >
      <Box dir={dir} sx={{ px: { xs: 2, sm: 3 }, pb: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
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
            <MapPin size={24} />
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

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            bgcolor: "background.paper",
            p: 2.5,
            mb: 2.5,
          }}
        >
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mt: 1.5,
            }}
          >
            <TextField
              label={t("distanceMetersLabel")}
              value={distanceDisplay}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              sx={readOnlyFieldSx}
              inputProps={{ dir: "ltr" }}
            />
            <TextField
              label={t("isInsideLocationLabel")}
              value={insideLocationDisplay}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              sx={readOnlyFieldSx}
            />
          </Box>
        </Box>

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
                <MapPin size={16} />
              )
            }
            sx={{ py: 1.25, borderRadius: 2, fontWeight: 700 }}
          >
            {mutation.isPending
              ? t("submitting")
              : isLocationLoading
                ? t("fetchingLocation")
                : t("confirmButton")}
          </Button>
        </Box>
      </Box>
    </AttendanceDialogShell>
  );
}
