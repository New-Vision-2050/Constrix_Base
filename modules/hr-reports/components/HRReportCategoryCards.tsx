"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";
import {
  Printer,
  FolderClosed,
  LineChart,
  FileText,
  LucideIcon,
} from "lucide-react";
import { ROUTER } from "@/router";
import { cn } from "@/lib/utils";

type CategoryDef = {
  key:
    | "attendanceReports"
    | "employeeReports"
    | "performanceReports"
    | "generalReports";
  icon: LucideIcon;
  href?: string;
  disabled?: boolean;
};

const CATEGORIES: CategoryDef[] = [
  {
    key: "attendanceReports",
    icon: FileText,
    href: ROUTER.HR_REPORTS_ATTENDANCE,
  },
  { key: "employeeReports", icon: FolderClosed, disabled: true },
  { key: "performanceReports", icon: LineChart, disabled: true },
  { key: "generalReports", icon: Printer, disabled: true },
];

function CardInner({
  icon: Icon,
  label,
  disabled,
  disabledHint,
}: {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  disabledHint?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-muted/40 px-4 py-8 text-center shadow-sm transition-colors",
        disabled
          ? "cursor-not-allowed opacity-45 grayscale-[0.35]"
          : "cursor-pointer hover:border-primary/40 hover:bg-muted/70",
      )}
      title={disabled ? disabledHint : undefined}
    >
      <Icon
        className={cn(
          "size-12 shrink-0 stroke-[1.35]",
          disabled ? "text-muted-foreground" : "text-blue-500",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "text-base font-semibold leading-snug",
          disabled ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default function HRReportCategoryCards() {
  const t = useTranslations("HRReports");

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CATEGORIES.map((cat) => {
        const label = t(cat.key);

        if (cat.href && !cat.disabled) {
          return (
            <Link
              key={cat.key}
              href={cat.href}
              className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
            >
              <CardInner icon={cat.icon} label={label} />
            </Link>
          );
        }

        return (
          <div
            key={cat.key}
            className="pointer-events-none"
            aria-disabled
            role="group"
          >
              <CardInner icon={cat.icon} label={label} disabledHint={t("categoryComingSoon")} disabled />
          </div>
        );
      })}
    </div>
  );
}
