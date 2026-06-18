"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check, LogIn, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import InfoIcon from "@/public/icons/info";
import { LocationWork } from "@/services/api/user-attendance";
import {
  useClockInMutation,
  useClockOutMutation,
} from "../../hooks/useAttendanceActions";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { getLateMinutes, useFormattedNow } from "../../utils/attendance";
import {
  GeolocationRequestError,
  getDistanceKilometers,
  isWithinRadius,
  requestCurrentLocation,
} from "../../utils/geolocation";
import AttendanceDialogShell, {
  AttendanceDialogDate,
  AttendanceDialogIcon,
  AttendanceDialogTime,
} from "./AttendanceDialogShell";
import { useAttendanceDirection } from "../../utils/direction";
import { StatusDot } from "../shared/StatusDot";
import { STATUS_HEX_COLORS } from "../../utils/status-colors";

const AttendanceLocationMap = dynamic(() => import("./AttendanceLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="h-52 rounded-xl bg-muted animate-pulse" />
  ),
});

type DialogStep =
  | "closed"
  | "location-permission"
  | "out-of-location"
  | "clock-in-confirm"
  | "clock-in-success"
  | "clock-out-confirm"
  | "clock-out-success";

interface AttendanceActionDialogsProps {
  isClockOut: boolean;
  startTime: string;
  locationWork: LocationWork;
  disabled?: boolean;
}

function getApiErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  return undefined;
}

export default function AttendanceActionDialogs({
  isClockOut,
  startTime,
  locationWork,
  disabled = false,
}: AttendanceActionDialogsProps) {
  const t = useTranslations("AttendancePresence");
  const { isRtl } = useAttendanceDirection();
  const now = useCurrentDateTime();
  const { timeParts, fullDate } = useFormattedNow(now);

  const [step, setStep] = useState<DialogStep>("closed");
  const [userCoords, setUserCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [lateMinutes, setLateMinutes] = useState(0);

  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();
  const isSubmitting = clockInMutation.isPending || clockOutMutation.isPending;

  const reset = useCallback(() => {
    setStep("closed");
    setUserCoords(null);
    setDistanceKm(0);
    setLateMinutes(0);
  }, []);

  const proceedWithLocation = useCallback(
    async (latitude: number, longitude: number) => {
      setUserCoords({ latitude, longitude });

      const withinRadius = isWithinRadius(
        latitude,
        longitude,
        locationWork.latitude,
        locationWork.longitude,
        locationWork.radius,
      );

      if (!withinRadius) {
        setDistanceKm(
          getDistanceKilometers(
            latitude,
            longitude,
            locationWork.latitude,
            locationWork.longitude,
          ),
        );
        setStep("out-of-location");
        return;
      }

      if (isClockOut) {
        setStep("clock-out-confirm");
        return;
      }

      setLateMinutes(getLateMinutes(now, startTime));
      setStep("clock-in-confirm");
    },
    [isClockOut, locationWork, now, startTime],
  );

  const startAttendanceFlow = useCallback(async () => {
    if (disabled) return;

    try {
      const position = await requestCurrentLocation();
      await proceedWithLocation(
        position.coords.latitude,
        position.coords.longitude,
      );
    } catch (error) {
      if (error instanceof GeolocationRequestError) {
        setStep("location-permission");
        return;
      }

      toast.error(t("attendanceActionError"));
    }
  }, [disabled, proceedWithLocation, t]);

  const handleConfirm = async () => {
    if (!userCoords) return;

    try {
      if (isClockOut) {
        await clockOutMutation.mutateAsync({
          location: userCoords,
        });
        setStep("clock-out-success");
        return;
      }

      await clockInMutation.mutateAsync({
        location: userCoords,
      });
      setStep("clock-in-success");
    } catch (error) {
      toast.error(getApiErrorMessage(error) ?? t("attendanceActionError"));
    }
  };

  const buttonLabel = useMemo(
    () => (isClockOut ? t("registerDeparture") : t("registerAttendance")),
    [isClockOut, t],
  );

  const confirmCancelButtons = (
    <>
      <Button
        className="min-w-32"
        loading={isSubmitting}
        onClick={handleConfirm}
      >
        {t("confirm")}
      </Button>
      <Button variant="outline" className="min-w-32" onClick={reset}>
        {t("cancel")}
      </Button>
    </>
  );

  const outOfLocationButtons = (
    <>
      <Button className="min-w-32" onClick={reset}>
        {t("back")}
      </Button>
      <Button
        variant="outline"
        className="min-w-32"
        onClick={() => setStep("closed")}
      >
        {t("requestWorkMission")}
      </Button>
    </>
  );

  return (
    <>
      <Button
        className="w-full h-11"
        disabled={disabled}
        onClick={startAttendanceFlow}
      >
        {isClockOut ? (
          <LogOut size={18} className="me-2" />
        ) : (
          <LogIn size={18} className="me-2" />
        )}
        {buttonLabel}
      </Button>

      <AttendanceDialogShell open={step === "location-permission"} onClose={reset}>
        <div className="flex justify-center mb-5">
          <InfoIcon />
        </div>
        <h3 className="text-center text-xl font-semibold text-foreground mb-2">
          {t("enableLocationTitle")}
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          {t("enableLocationDescription")}
        </p>
      </AttendanceDialogShell>

      <AttendanceDialogShell open={step === "out-of-location"} onClose={reset}>
        <div className="flex justify-center mb-5">
          <InfoIcon />
        </div>
        <h3 className="text-center text-xl font-semibold text-foreground mb-2">
          {t("currentLocationTitle")}
        </h3>
        <p className="text-center text-sm text-muted-foreground mb-4">
          {t("outOfLocationMessage", {
            distance: distanceKm.toFixed(1),
            location: locationWork.name,
          })}
        </p>
        {userCoords ? (
          <AttendanceLocationMap
            workLat={locationWork.latitude}
            workLng={locationWork.longitude}
            userLat={userCoords.latitude}
            userLng={userCoords.longitude}
            radius={locationWork.radius}
          />
        ) : null}
        <div
          className={`mt-6 flex items-center justify-center gap-3 ${
            isRtl ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {outOfLocationButtons}
        </div>
      </AttendanceDialogShell>

      <AttendanceDialogShell open={step === "clock-in-confirm"} onClose={reset}>
        <div className="flex justify-center mb-5">
          <InfoIcon />
        </div>
        <h3 className="text-center text-xl font-semibold text-foreground mb-2">
          {t("confirmClockInTitle")}
        </h3>
        {lateMinutes > 0 ? (
          <p className="text-center text-sm text-muted-foreground mb-2">
            {t("clockInLateMessage", { minutes: lateMinutes })}
          </p>
        ) : null}
        <AttendanceDialogTime time={timeParts.time} period={timeParts.period} />
        <AttendanceDialogDate label={fullDate} />
        <div
          className={`mt-6 flex items-center justify-center gap-3 ${
            isRtl ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {confirmCancelButtons}
        </div>
      </AttendanceDialogShell>

      <AttendanceDialogShell open={step === "clock-in-success"} onClose={reset}>
        <AttendanceDialogIcon variant="success">
          <Check className="text-primary-foreground" size={28} strokeWidth={3} />
        </AttendanceDialogIcon>
        <h3 className="text-center text-xl font-semibold text-foreground mb-3">
          {t("clockInSuccessTitle")}
        </h3>
        {lateMinutes > 0 ? (
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-chart-4/40 bg-chart-4/10 px-3 py-1 text-sm text-chart-4">
              <StatusDot
                dotColor={STATUS_HEX_COLORS.late}
                className="size-2"
              />
              {t("lateByMinutes", { minutes: lateMinutes })}
            </span>
          </div>
        ) : null}
        <AttendanceDialogTime time={timeParts.time} period={timeParts.period} />
        <AttendanceDialogDate label={fullDate} />
      </AttendanceDialogShell>

      <AttendanceDialogShell open={step === "clock-out-confirm"} onClose={reset}>
        <div className="flex justify-center mb-5">
          <InfoIcon />
        </div>
        <h3 className="text-center text-xl font-semibold text-foreground mb-2">
          {t("confirmClockOutTitle")}
        </h3>
        <AttendanceDialogTime time={timeParts.time} period={timeParts.period} />
        <AttendanceDialogDate label={fullDate} />
        <div
          className={`mt-6 flex items-center justify-center gap-3 ${
            isRtl ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {confirmCancelButtons}
        </div>
      </AttendanceDialogShell>

      <AttendanceDialogShell open={step === "clock-out-success"} onClose={reset}>
        <AttendanceDialogIcon variant="success">
          <Check className="text-primary-foreground" size={28} strokeWidth={3} />
        </AttendanceDialogIcon>
        <h3 className="text-center text-xl font-semibold text-foreground mb-3">
          {t("clockOutSuccessTitle")}
        </h3>
        <AttendanceDialogTime time={timeParts.time} period={timeParts.period} />
        <AttendanceDialogDate label={fullDate} />
      </AttendanceDialogShell>
    </>
  );
}
