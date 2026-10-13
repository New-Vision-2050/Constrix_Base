"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/shared/Pagination";
import { cn } from "@/lib/utils";
import useUserLeaveRequests from "../hooks/useUserLeaveRequests";
import { UserLeaveRequest } from "../types";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

const ALL_STATUSES = "all";
const PER_PAGE = 10;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  approved: "bg-emerald-500/15 text-emerald-400",
  rejected: "bg-red-500/15 text-red-400",
  cancelled: "bg-gray-500/15 text-gray-400",
};

const STATUS_KEYS = ["pending", "approved", "rejected", "cancelled"] as const;

type Props = {
  userId: string;
};

function StatusChip({ request }: { request: UserLeaveRequest }) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();
  const status = String(request.status || "pending");

  const label =
    locale === "ar" && request.status_label_ar
      ? request.status_label_ar
      : STATUS_KEYS.includes(status as (typeof STATUS_KEYS)[number])
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

/**
 * Optional profile tab: the user's leave requests (admin list) with
 * status/year filters and pagination.
 */
export default function UserLeaveRequestsList({ userId }: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();

  const [status, setStatus] = useState<string>(ALL_STATUSES);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useUserLeaveRequests({
    userId,
    status: status === ALL_STATUSES ? undefined : status,
    year,
    page,
    perPage: PER_PAGE,
  });

  const rows = data?.rows ?? [];
  const lastPage = data?.lastPage ?? 1;

  const formatDate = (value?: string) => {
    if (!value) return t("emptyValue");
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? value
      : parsed.toLocaleDateString(locale);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES}>{t("allStatuses")}</SelectItem>
            {STATUS_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`statuses.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year ? String(year) : ALL_STATUSES}
          onValueChange={(value) => {
            setYear(value === ALL_STATUSES ? undefined : Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t("year")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES}>{t("allYears")}</SelectItem>
            {Array.from(
              { length: 5 },
              (_, idx) => new Date().getFullYear() + 1 - idx,
            ).map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-12 animate-pulse rounded-lg bg-white/5"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          {t("noRequests")}
        </p>
      ) : (
        <div
          className={cn(
            "overflow-x-auto rounded-lg border border-gray-700",
            isFetching && "opacity-60",
          )}
        >
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-white/5 text-gray-300">
                <th className="px-4 py-3 text-start font-medium">
                  {t("leaveType")}
                </th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("startDate")}
                </th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("endDate")}
                </th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("days")}
                </th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-gray-800 last:border-0 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-medium">
                    {request.leave_type_name ||
                      request.leave_policy_name ||
                      t("emptyValue")}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(request.start_date)}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(request.end_date)}
                  </td>
                  <td className="px-4 py-3">
                    {request.days_count ?? t("emptyValue")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip request={request} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lastPage > 1 && (
        <div className="mt-2 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={lastPage}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
