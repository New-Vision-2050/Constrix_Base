"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Ban, Clock3, DoorOpen } from "lucide-react";

type NotificationKey =
  | "lateForAppointment"
  | "unjustifiedAbsence"
  | "earlyDeparture";

const ROWS: {
  key: NotificationKey;
  label: string;
  hint: string;
  icon: typeof Clock3;
}[] = [
  {
    key: "lateForAppointment",
    label: "اشعار عند التأخير عن الموعد",
    hint: "تنبيه عند تجاوز وقت الحضور المحدد للموظف",
    icon: Clock3,
  },
  {
    key: "unjustifiedAbsence",
    label: "إشعار عند الغياب غير المبرر",
    hint: "تنبيه عند تسجيل غياب دون إذن أو عذر مقبول",
    icon: Ban,
  },
  {
    key: "earlyDeparture",
    label: "إشعار عند الخروج المبكر",
    hint: "تنبيه عند مغادرة العمل قبل انتهاء وقت الدوام",
    icon: DoorOpen,
  },
];

const INITIAL: Record<NotificationKey, boolean> = {
  lateForAppointment: true,
  unjustifiedAbsence: false,
  earlyDeparture: true,
};

export default function NotificationsSettingsSection() {
  const [flags, setFlags] = useState<Record<NotificationKey, boolean>>(INITIAL);

  const setFlag = (key: NotificationKey, value: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full">
      <section className="rounded-xl border border-primary/90 px-4 pb-5 pt-9 shadow-sm backdrop-blur-[2px]">
        <h2 className="px-3 pb-5 text-sm font-semibold tracking-tight text-foreground">
          اعدادات الاشعارات
        </h2>

        <div className="flex flex-col gap-3">
          {ROWS.map(({ key, label, hint, icon: Icon }) => {
            const enabled = flags[key];
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
                    onCheckedChange={(value) => setFlag(key, value)}
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
