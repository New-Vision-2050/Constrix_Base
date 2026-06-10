"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Clock3, DoorOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AttendanceConstraints } from "@/services/api/attendance-constraints";
import type { ConstraintNotifications } from "@/services/api/attendance-constraints/types/response";
import {
  constraintNotificationsQueryKey,
  mergeNotificationValues,
  notificationValuesToPatchBody,
  useConstraintNotifications,
} from "@/modules/hr-settings-attendance-departure/tabs/attendance-determinants/hooks/useConstraintNotifications";

type NotificationKey = keyof ConstraintNotifications;

const ROWS: {
  key: NotificationKey;
  label: string;
  hint: string;
  icon: typeof Clock3;
}[] = [
  {
    key: "notify_late_arrival",
    label: "اشعار عند التأخير عن الموعد",
    hint: "تنبيه عند تجاوز وقت الحضور المحدد للموظف",
    icon: Clock3,
  },
  {
    key: "notify_unexcused_absence",
    label: "إشعار عند الغياب غير المبرر",
    hint: "تنبيه عند تسجيل غياب دون إذن أو عذر مقبول",
    icon: Ban,
  },
  {
    key: "notify_early_departure",
    label: "إشعار عند الخروج المبكر",
    hint: "تنبيه عند مغادرة العمل قبل انتهاء وقت الدوام",
    icon: DoorOpen,
  },
];

const DEFAULT_VALUES: ConstraintNotifications = {
  notify_late_arrival: false,
  notify_unexcused_absence: false,
  notify_early_departure: false,
};

export default function NotificationsSettingsSection({
  constraintId,
}: {
  constraintId: string;
}) {
  const queryClient = useQueryClient();
  const notificationsQuery = useConstraintNotifications(constraintId);
  const [values, setValues] = useState<ConstraintNotifications>(DEFAULT_VALUES);

  useEffect(() => {
    if (notificationsQuery.status !== "success") return;
    setValues(mergeNotificationValues(notificationsQuery.data));
  }, [notificationsQuery.data, notificationsQuery.status]);

  const patchNotificationsMutation = useMutation({
    mutationFn: (body: ConstraintNotifications) =>
      AttendanceConstraints.patchNotifications(
        constraintId,
        notificationValuesToPatchBody(body),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: constraintNotificationsQueryKey(constraintId),
      });
      toast.success("تم حفظ إعدادات الاشعارات");
    },
    onError: () => {
      toast.error("فشل حفظ إعدادات الاشعارات");
    },
  });

  const handleToggle = (key: NotificationKey, checked: boolean) => {
    const previous = values;
    const next = { ...values, [key]: checked };
    setValues(next);
    patchNotificationsMutation.mutate(next, {
      onError: () => {
        setValues(previous);
      },
    });
  };

  const isLoading = notificationsQuery.isLoading;
  const isSaving = patchNotificationsMutation.isPending;

  return (
    <div className="w-full">
      <section className="rounded-xl border border-primary/90 px-4 pb-5 pt-9 shadow-sm backdrop-blur-[2px]">
        <h2 className="px-3 pb-5 text-sm font-semibold tracking-tight text-foreground">
          اعدادات الاشعارات
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
          </div>
        ) : null}

        <div className={cn("flex flex-col gap-3", isLoading && "hidden")}>
          {ROWS.map(({ key, label, hint, icon: Icon }) => {
            const enabled = values[key];
            return (
              <div
                key={key}
                className={cn(
                  "rounded-lg border px-4 py-3.5 transition-colors",
                  enabled
                    ? "border-primary/35 bg-primary/[0.06]"
                    : "border-border bg-muted/20",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        enabled
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : "border-border bg-muted/50 text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 text-right">
                      <p className="text-sm font-medium leading-snug text-foreground">
                        {label}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {hint}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={enabled}
                    disabled={isSaving}
                    onCheckedChange={(checked) => handleToggle(key, checked)}
                    className="shrink-0 data-[state=checked]:bg-primary"
                    aria-label={label}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
