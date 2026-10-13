"use client";

import { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdvanceRequest } from "../hooks";
import AdvanceStatusChip from "./AdvanceStatusChip";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

type Props = {
  requestId: string | null;
  onClose: () => void;
};

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-800 py-2 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-end text-sm font-medium">{value}</span>
    </div>
  );
}

/** Detail view from GET /advance-requests/{id}. */
export default function AdvanceRequestDetailsDialog({ requestId, onClose }: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();
  const { data: request, isLoading } = useAdvanceRequest(requestId);
  const empty = t("emptyValue");

  const formatDate = (value?: string | null) => {
    if (!value) return empty;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString(locale);
  };

  return (
    <Dialog open={Boolean(requestId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("advanceRequestDetails")}</DialogTitle>
        </DialogHeader>

        {isLoading || !request ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-8 animate-pulse rounded bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            <DetailRow label={t("status")} value={<AdvanceStatusChip request={request} />} />
            <DetailRow
              label={t("policyName")}
              value={request.advance_policy_name || empty}
            />
            <DetailRow
              label={t("advanceAmount")}
              value={Number(request.amount ?? 0).toLocaleString(locale)}
            />
            <DetailRow
              label={t("advanceInstallments")}
              value={request.installments ?? empty}
            />
            <DetailRow label={t("advanceReason")} value={request.reason || empty} />
            <DetailRow label={t("advanceNotes")} value={request.notes || empty} />
            {request.status === "rejected" ? (
              <DetailRow
                label={t("advanceRejectionReason")}
                value={request.rejection_reason || empty}
              />
            ) : null}
            {request.status === "pending" && request.workflow?.in_progress ? (
              <DetailRow
                label={t("advanceWorkflowStep")}
                value={request.workflow.pending_step_order ?? empty}
              />
            ) : null}
            <DetailRow label={t("createdAt")} value={formatDate(request.created_at)} />
            {request.approved_at ? (
              <DetailRow label={t("approvedAt")} value={formatDate(request.approved_at)} />
            ) : null}
            {request.rejected_at ? (
              <DetailRow label={t("rejectedAt")} value={formatDate(request.rejected_at)} />
            ) : null}
            <DetailRow
              label={t("advanceAttachments")}
              value={
                request.attachments && request.attachments.length > 0 ? (
                  <span className="flex flex-col items-end gap-1">
                    {request.attachments.map((attachment, idx) => (
                      <a
                        key={`${attachment}-${idx}`}
                        href={attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        {t("attachmentN", { n: idx + 1 })}
                      </a>
                    ))}
                  </span>
                ) : (
                  empty
                )
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
