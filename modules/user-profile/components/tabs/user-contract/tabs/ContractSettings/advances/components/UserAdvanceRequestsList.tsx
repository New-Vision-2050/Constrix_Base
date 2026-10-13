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
import { useUserAdvancePolicies, useUserAdvanceRequests } from "../hooks";
import AdvanceStatusChip, { ADVANCE_STATUS_KEYS } from "./AdvanceStatusChip";
import AdvanceRequestDetailsDialog from "./AdvanceRequestDetailsDialog";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

const ALL = "all";
const PER_PAGE = 10;

/** The user's advance requests with status/policy filters; row click opens details. */
export default function UserAdvanceRequestsList({ userId }: { userId: string }) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();

  const [status, setStatus] = useState<string>(ALL);
  const [policyId, setPolicyId] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const [openRequestId, setOpenRequestId] = useState<string | null>(null);

  const { data: policies = [] } = useUserAdvancePolicies(userId);
  const { data, isLoading, isFetching } = useUserAdvanceRequests({
    userId,
    status: status === ALL ? undefined : status,
    advancePolicyId: policyId === ALL ? undefined : policyId,
    page,
    perPage: PER_PAGE,
  });

  const rows = data?.rows ?? [];
  const lastPage = data?.lastPage ?? 1;

  const formatDate = (value?: string) => {
    if (!value) return t("emptyValue");
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString(locale);
  };

  return (
    <div className="flex flex-col gap-4">
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
            <SelectItem value={ALL}>{t("allStatuses")}</SelectItem>
            {ADVANCE_STATUS_KEYS.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`statuses.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={policyId}
          onValueChange={(value) => {
            setPolicyId(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("policyName")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allPolicies")}</SelectItem>
            {policies.map((policy) => (
              <SelectItem key={policy.advance_policy_id} value={policy.advance_policy_id}>
                {policy.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-12 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          {t("noAdvanceRequests")}
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
                <th className="px-4 py-3 text-start font-medium">{t("advanceAmount")}</th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("advanceInstallments")}
                </th>
                <th className="px-4 py-3 text-start font-medium">{t("policyName")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("status")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("createdAt")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => setOpenRequestId(request.id)}
                  className="cursor-pointer border-b border-gray-800 last:border-0 hover:bg-white/5"
                >
                  <td className="px-4 py-3 font-medium">
                    {Number(request.amount ?? 0).toLocaleString(locale)}
                  </td>
                  <td className="px-4 py-3">{request.installments ?? t("emptyValue")}</td>
                  <td className="px-4 py-3">
                    {request.advance_policy_name || t("emptyValue")}
                  </td>
                  <td className="px-4 py-3">
                    <AdvanceStatusChip request={request} />
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {formatDate(request.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lastPage > 1 && (
        <div className="mt-2 flex justify-center">
          <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
      )}

      <AdvanceRequestDetailsDialog
        requestId={openRequestId}
        onClose={() => setOpenRequestId(null)}
      />
    </div>
  );
}
