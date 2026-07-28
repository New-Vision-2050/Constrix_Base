"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import InfoIcon from "@/public/icons/info";
import {
  LocationWork,
  WorkPeriodConstraint,
} from "@/services/api/user-attendance";
import {
  useClockInMutation,
  useClockOutMutation,
} from "../../hooks/useAttendanceActions";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import {
  getLateMinutes,
  useFormattedNow,
} from "../../utils/attendance";
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
import {
  CheckInActionIcon,
  CheckOutActionIcon,
  TodayLogActionButtonContent,
} from "./TodayLogUi";
import { useAttendanceDirection } from "../../utils/direction";
import { StatusDot } from "../shared/StatusDot";
import { STATUS_HEX_COLORS } from "../../utils/status-colors";

const AttendanceLocationMap = dynamic(() => import("./AttendanceLocationMap"), {
  ssr: false,
  loading: () => <div className="h-52 rounded-xl bg-muted animate-pulse" />,
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
  workPeriod: WorkPeriodConstraint;
  locationWork: LocationWork;
  additionalLocations?: LocationWork[];
  disabled?: boolean;
}

const CLOCK_IN_ERROR_TYPE_KEYS: Record<string, string> = {
  clock_in_too_early: "clockInTooEarly",
  clock_in_deadline_passed: "clockInDeadlinePassed",
  clock_in_window_closed: "clockInWindowClosed",
};

function getApiErrorMessage(error: unknown, t: (key: string) => string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string; errors?: { type?: string }[]; error?: { type?: string } } } }).response;
    const data = response?.data;

    if (data?.errors && Array.isArray(data.errors)) {
      for (const err of data.errors) {
        if (err?.type && CLOCK_IN_ERROR_TYPE_KEYS[err.type]) {
          return t(CLOCK_IN_ERROR_TYPE_KEYS[err.type]);
        }
      }
    }

    if (data?.error?.type && CLOCK_IN_ERROR_TYPE_KEYS[data.error.type]) {
      return t(CLOCK_IN_ERROR_TYPE_KEYS[data.error.type]);
    }

    if (typeof data?.message === "string") {
      return data.message;
    }
  }

  return undefined;
}

export default function AttendanceActionDialogs({
  workPeriod,
  locationWork,
  additionalLocations = [],
  disabled = false,
}: AttendanceActionDialogsProps) {
  const t = useTranslations("AttendancePresence");
  const { isRtl } = useAttendanceDirection();
  const now = useCurrentDateTime();
  const { timeParts, fullDate } = useFormattedNow(now);

  const isClockOut = workPeriod.can_clock_out;
  const startTime = workPeriod.start_time;

  const [step, setStep] = useState<DialogStep>("closed");
  const [userCoords, setUserCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [lateMinutes, setLateMinutes] = useState(0);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

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

      const allLocations = [locationWork, ...additionalLocations];
      const withinAny = allLocations.some((loc) =>
        isWithinRadius(
          latitude,
          longitude,
          loc.latitude,
          loc.longitude,
          loc.radius,
        ),
      );

      if (!withinAny) {
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
    [isClockOut, locationWork, additionalLocations, now, startTime],
  );

  const startAttendanceFlow = useCallback(async () => {
    if (disabled) return;

    setIsFetchingLocation(true);
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
    } finally {
      setIsFetchingLocation(false);
    }
  }, [disabled, isClockOut, now, proceedWithLocation, t, workPeriod]);

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
      toast.error(getApiErrorMessage(error, t) ?? t("attendanceActionError"));
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
      <Button className="min-w-[120px] h-10 rounded-full" onClick={reset}>
        {t("back")}
      </Button>
      <Button
        variant="outline"
        className="min-w-[140px] h-10 rounded-full border-border"
        onClick={() => setStep("closed")}
      >
        {t("requestWorkMission")}
      </Button>
    </>
  );

  return (
    <>
      <Button
        className="h-12 w-full rounded-xl border-0 bg-[#FF2D78] text-base font-medium text-white hover:bg-[#FF2D78]/90"
        disabled={disabled || isFetchingLocation}
        loading={isFetchingLocation}
        onClick={startAttendanceFlow}
      >
        <TodayLogActionButtonContent
          label={buttonLabel}
          icon={isClockOut ? <CheckOutActionIcon /> : <CheckInActionIcon />}
        />
      </Button>

      <AttendanceDialogShell
        open={step === "location-permission"}
        onClose={reset}
        title={t("enableLocationTitle")}
      >
        <div className="flex justify-center mb-2">
          <InfoIcon />
        </div>
        <h3 className="text-center text-xl font-semibold text-foreground mb-2">
          {t("enableLocationTitle")}
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          {t("enableLocationDescription")}
        </p>
      </AttendanceDialogShell>

      <AttendanceDialogShell
        open={step === "out-of-location"}
        onClose={reset}
        title={t("currentLocationTitle")}
        className="max-w-[620px]"
      >
        <div className="flex justify-center mb-2">
          <InfoIcon />
        </div>
        <h3 className="text-center text-xl font-semibold text-foreground ">
          {t("currentLocationTitle")}
        </h3>
        <p className="text-center text-sm text-muted-foreground leading-relaxed px-1">
          {t.rich("outOfLocationMessage", {
            distance: distanceKm.toFixed(1),
            bold: (chunks) => (
              <span className="font-semibold text-foreground">{chunks}</span>
            ),
          })}
        </p>
        {userCoords ? (
          <AttendanceLocationMap
            workLat={locationWork.latitude}
            workLng={locationWork.longitude}
            userLat={userCoords.latitude}
            userLng={userCoords.longitude}
            radius={locationWork.radius}
            userLabel={t("meLabel")}
          />
        ) : null}
        <div
          className={`mt-5 flex items-center gap-3 ${
            isRtl ? "flex-row justify-end" : "flex-row-reverse justify-end"
          }`}
        >
          {outOfLocationButtons}
        </div>
      </AttendanceDialogShell>

      <AttendanceDialogShell
        open={step === "clock-in-confirm"}
        onClose={reset}
        title={t("confirmClockInTitle")}
      >
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

      <AttendanceDialogShell
        open={step === "clock-in-success"}
        onClose={reset}
        title={t("clockInSuccessTitle")}
      >
        <AttendanceDialogIcon variant="success">
          <Check
            className="text-primary-foreground"
            size={28}
            strokeWidth={3}
          />
        </AttendanceDialogIcon>
        <h3 className="text-center text-xl font-semibold text-foreground mb-3">
          {t("clockInSuccessTitle")}
        </h3>
        {lateMinutes > 0 ? (
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-chart-4/40 bg-chart-4/10 px-3 py-1 text-sm text-chart-4">
              <StatusDot dotColor={STATUS_HEX_COLORS.late} className="size-2" />
              {t("lateByMinutes", { minutes: lateMinutes })}
            </span>
          </div>
        ) : null}
        <AttendanceDialogTime time={timeParts.time} period={timeParts.period} />
        <AttendanceDialogDate label={fullDate} />
      </AttendanceDialogShell>

      <AttendanceDialogShell
        open={step === "clock-out-confirm"}
        onClose={reset}
        title={t("confirmClockOutTitle")}
      >
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

      <AttendanceDialogShell
        open={step === "clock-out-success"}
        onClose={reset}
        title={t("clockOutSuccessTitle")}
      >
        <AttendanceDialogIcon variant="success">
          <Check
            className="text-primary-foreground"
            size={28}
            strokeWidth={3}
          />
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
