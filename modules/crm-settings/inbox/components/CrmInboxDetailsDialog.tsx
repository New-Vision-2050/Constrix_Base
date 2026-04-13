"use client";

import { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { ClientRequestRow } from "@/services/api/client-requests";
import { formatInboxSentDate } from "@/modules/projects/inbox/inbox-columns";
import {
  ApprovalTimeline,
  InboxRequestDetailDialog,
  InboxRequestThreeStatCards,
  InboxRequestDescriptionSection,
  InboxRequestAttachmentsSection,
  InboxRequestActionRow,
  InboxRequestApprovalPathCard,
  InboxRequestCommentsField,
  buildClientRequestApprovalTimelineEntries,
} from "@/modules/crm-settings/inbox/components/inbox-request-dialog";

function clientRequestStatusLabel(
  status: string,
  tStatus: (key: string) => string,
  tInbox: (key: string) => string,
): string {
  const key = status.trim().toLowerCase();
  switch (key) {
    case "pending":
      return tStatus("clientRequests.status.pending");
    case "accepted":
      return tStatus("clientRequests.status.accepted");
    case "rejected":
      return tStatus("clientRequests.status.rejected");
    case "draft":
      return tStatus("clientRequests.status.draft");
    case "approved":
      return tStatus("clientRequests.status.approved");
    default:
      return status.trim() || tInbox("emptyDash");
  }
}

export type CrmInboxDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  row: ClientRequestRow | null;
  onAccept: () => void;
  onReject: (rejectCause: string) => void;
  actionPending: boolean;
  canRespond: boolean;
  canUpdateStatus: boolean;
};

/**
 * CRM client-request inbox detail view; composes generic `InboxRequestDetailDialog` + sections.
 * Reuse the primitives from `@/modules/crm-settings/inbox/components/inbox-request-dialog` elsewhere.
 */
export default function CrmInboxDetailsDialog({
  open,
  onClose,
  row,
  onAccept,
  onReject,
  actionPending,
  canRespond,
  canUpdateStatus,
}: CrmInboxDetailsDialogProps) {
  const t = useTranslations("project.inbox");
  const tClient = useTranslations();
  const tDoc = useTranslations("project.documentCycle");
  const [commentDraft, setCommentDraft] = useState("");

  useEffect(() => {
    if (open) {
      setCommentDraft("");
    }
  }, [open, row?.id]);

  const descriptionBody = useMemo(() => {
    if (!row?.content?.trim()) return t("emptyDash");
    return row.content.trim();
  }, [row, t]);

  const sentFormatted = row?.created_at
    ? formatInboxSentDate(row.created_at).trim()
    : "";
  const sentLabel = sentFormatted || t("emptyDash");

  const typeLabel =
    row?.client_request_type?.name?.trim() || t("emptyDash");

  const statusLabel = row
    ? clientRequestStatusLabel(row.status_client_request, tClient, t)
    : t("emptyDash");

  const timelineEntries = useMemo(
    () =>
      row ? buildClientRequestApprovalTimelineEntries(row, tDoc, t) : [],
    [row, tDoc, t],
  );

  const handleAccept = () => {
    onAccept();
  };

  const handleReject = () => {
    const cause = commentDraft.trim();
    if (!cause) {
      toast.error(tClient("clientRequests.dialog.rejectCauseRequired"));
      return;
    }
    onReject(cause);
  };

  const respondDisabled =
    actionPending || !canRespond || !canUpdateStatus;
  const showActions = canRespond && canUpdateStatus;

  if (!row) {
    return null;
  }

  return (
    <InboxRequestDetailDialog
      open={open && !!row}
      onClose={onClose}
      title={t("dialogTitle")}
      subtitle={tClient("clientRequests.inbox.dialogSubtitle")}
      closeAriaLabel={t("closeDialog")}
      main={
        <Stack spacing={2.5} sx={{ minWidth: 0 }}>
          <InboxRequestThreeStatCards
            cards={[
              { caption: t("fieldType"), value: typeLabel },
              { caption: t("fieldCurrentApproval"), value: statusLabel },
              { caption: t("fieldSubmissionDate"), value: sentLabel },
            ]}
          />
          <InboxRequestDescriptionSection
            title={t("description")}
            body={descriptionBody}
          />
          <InboxRequestAttachmentsSection
            title={t("attachments")}
            emptyLabel={t("emptyDash")}
            links={
              row.attachments?.length
                ? row.attachments.map((a) => ({
                    id: a.id,
                    href: a.url,
                    label: a.name || a.url,
                    mimeType: a.mime_type,
                    fileName: a.name || undefined,
                  }))
                : undefined
            }
          />
          {showActions ? (
            <InboxRequestActionRow
              actions={[
                {
                  key: "accept",
                  label: t("accept"),
                  variant: "contained",
                  color: "secondary",
                  onClick: handleAccept,
                  disabled: respondDisabled,
                },
                {
                  key: "reject",
                  label: t("reject"),
                  variant: "outlined",
                  color: "error",
                  onClick: handleReject,
                  disabled: respondDisabled,
                },
                {
                  key: "close",
                  label: tClient("clientRequests.inbox.closeDialog"),
                  variant: "outlined",
                  color: "secondary",
                  onClick: onClose,
                },
              ]}
            />
          ) : null}
        </Stack>
      }
      sidebar={
        <Stack spacing={3} sx={{ height: "100%" }}>
          <InboxRequestApprovalPathCard title={t("approvalPath")}>
            <ApprovalTimeline entries={timelineEntries} />
          </InboxRequestApprovalPathCard>
          <InboxRequestCommentsField
            sectionTitle={t("comments")}
            value={commentDraft}
            onChange={setCommentDraft}
            placeholder={
              canRespond && canUpdateStatus
                ? tClient("clientRequests.dialog.rejectCausePlaceholder")
                : t("commentPlaceholder")
            }
            disabled={actionPending || !canRespond || !canUpdateStatus}
          />
        </Stack>
      }
    />
  );
}
