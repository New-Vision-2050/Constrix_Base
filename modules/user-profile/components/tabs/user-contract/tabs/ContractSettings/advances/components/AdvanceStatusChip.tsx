"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { AdvanceRequest } from "../types";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  approved: "bg-emerald-500/15 text-emerald-400",
  rejected: "bg-red-500/15 text-red-400",
  cancelled: "bg-gray-500/15 text-gray-400",
};

export const ADVANCE_STATUS_KEYS = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
] as const;

export default function AdvanceStatusChip({ request }: { request: AdvanceRequest }) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();
  const status = String(request.status || "pending");

  const label =
    locale === "ar" && request.status_label_ar
      ? request.status_label_ar
      : ADVANCE_STATUS_KEYS.includes(status as (typeof ADVANCE_STATUS_KEYS)[number])
        ? t(`statuses.${status}`)
        : status;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        STATUS_STYLES[status] ?? STATUS_STYLES.pending,
      )}
    >
      {label}
    </span>
  );
}
