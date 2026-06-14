"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapRangePicker } from "@/components/shared/map-range-picker";
import { AlertCircle, Navigation, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NationalAddressMapPayload = {
  longitude: string;
  latitude: string;
  radius: string;
  location: string;
};

const DEFAULT_COORD = "25.325348647861";
const DEFAULT_RADIUS = "1000";

type NationalAddressMapDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<NationalAddressMapPayload>;
  /** May return a Promise — dialog stays open until it rejects */
  onSave: (payload: NationalAddressMapPayload) => void | Promise<void>;
  savePending?: boolean;
};

export default function NationalAddressMapDialog({
  open,
  onOpenChange,
  initialValues,
  onSave,
  savePending = false,
}: NationalAddressMapDialogProps) {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.maps",
  );

  const [longitude, setLongitude] = useState(DEFAULT_COORD);
  const [latitude, setLatitude] = useState(DEFAULT_COORD);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [locationLabel, setLocationLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLongitude(initialValues?.longitude ?? DEFAULT_COORD);
    setLatitude(initialValues?.latitude ?? DEFAULT_COORD);
    setRadius(initialValues?.radius ?? DEFAULT_RADIUS);
    setLocationLabel(initialValues?.location ?? t("defaultLocation"));
    setSaveError(null);
    setSubmitting(false);
    setIsGettingLocation(false);
    setLocationError(null);
  }, [open, initialValues]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t("geolocationNotSupported"));
      return;
    }

    setLocationError(null);
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        setIsGettingLocation(false);
      },
      (error) => {
        let message = t("geolocationFailed");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = t("permissionDenied");
            break;
          case error.POSITION_UNAVAILABLE:
            message = t("locationUnavailable");
            break;
          case error.TIMEOUT:
            message = t("locationTimeout");
            break;
        }
        setLocationError(message);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const pin = useMemo(() => {
    const lat = Number.parseFloat(latitude.replace(",", "."));
    const lng = Number.parseFloat(longitude.replace(",", "."));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
    return { lat, lng };
  }, [latitude, longitude]);

  const mapFallbackCenter = useMemo(
    () => ({
      lat: Number.parseFloat(DEFAULT_COORD),
      lng: Number.parseFloat(DEFAULT_COORD),
    }),
    [],
  );

  const radiusMeters = useMemo(() => {
    const n = Number.parseFloat(radius.replace(",", "."));
    return Number.isFinite(n) && n > 0 ? n : 1000;
  }, [radius]);

  const handleSave = async () => {
    setSaveError(null);
    setSubmitting(true);
    try {
      await Promise.resolve(
        onSave({
          longitude,
          latitude,
          radius,
          location: locationLabel,
        }),
      );
      onOpenChange(false);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : t("saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || savePending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] max-w-3xl overflow-y-auto border-border bg-background p-0 sm:p-6",
        )}
        dir="rtl"
        withCrossButton={false}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute start-4 top-4 z-50 rounded-sm opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={t("mapDialogClose")}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-4 pt-10 sm:px-0 sm:pt-2">
          <DialogTitle className="text-center text-lg font-semibold leading-snug">
            {t("mapDialogTitle")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("mapDialogDescription")}
          </DialogDescription>
        </div>

        <div className="space-y-4 px-4 pb-4 pt-4 sm:px-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm">{t("longitudeLabel")}</label>
              <Input
                variant="secondary"
                dir="ltr"
                inputClassName="text-end font-mono text-sm"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder={DEFAULT_COORD}
              />
            </div>
            <div>
              <label className="text-sm">{t("latitudeLabel")}</label>
              <Input
                variant="secondary"
                dir="ltr"
                inputClassName="text-end font-mono text-sm"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder={DEFAULT_COORD}
              />
            </div>
            <div>
              <label className="text-sm">{t("radiusLabel")}</label>
              <Input
                variant="secondary"
                dir="ltr"
                inputClassName="text-end font-mono text-sm"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                placeholder={t("radiusPlaceholder")}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            className="w-full"
            disabled={isGettingLocation || isBusy}
            onClick={handleGetCurrentLocation}
          >
            <Navigation className="ms-2 h-4 w-4" aria-hidden />
            {isGettingLocation ? t("gettingLocation") : t("getCurrentLocation")}
          </Button>

          {locationError ? (
            <p className="text-sm text-destructive" role="alert">
              {locationError}
            </p>
          ) : null}

          <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20">
            <MapRangePicker
              onSelect={(lat, lng) => {
                setLatitude(String(lat));
                setLongitude(String(lng));
              }}
              currentPin={pin}
              radius={radiusMeters}
              center={pin ?? mapFallbackCenter}
              zoom={15}
              height="380px"
            />

            <div className="pointer-events-none absolute bottom-3 start-3 z-[5] max-w-[min(90%,260px)] rounded-md bg-black/65 px-3 py-2 text-[11px] leading-snug text-white backdrop-blur-sm">
              {t("zoneStatus")}
            </div>

            <div className="pointer-events-none absolute bottom-3 end-3 z-[5] flex max-w-[min(92%,300px)] gap-2 rounded-lg border border-red-900/40 bg-red-950/90 p-3 text-[11px] leading-snug text-red-50 shadow-lg backdrop-blur-sm">
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-400"
                aria-hidden
              />
              <div className="space-y-1 text-right">
                <p className="font-semibold text-amber-100">
                  {t("outOfBoundsTitle", { radius: radiusMeters })}
                </p>
                <p className="text-red-100/95">
                  {t("outOfBoundsText")}
                </p>
              </div>
            </div>
          </div>

          {saveError ? (
            <p className="text-sm text-destructive" role="alert">
              {saveError}
            </p>
          ) : null}

          <div
            className="flex justify-between gap-3 border-t border-border pt-4"
            dir="rtl"
          >
            <Button
              type="button"
              variant="default"
              onClick={() => void handleSave()}
              disabled={isBusy}
            >
              {isBusy ? t("savingText") : t("save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancelButton")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
