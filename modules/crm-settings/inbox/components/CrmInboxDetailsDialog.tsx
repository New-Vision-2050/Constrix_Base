"use client";

import { useTranslations } from "next-intl";
import type { ClientRequestRow } from "@/services/api/client-requests";
import { InboxRequestDetailDialog } from "@/modules/crm-settings/inbox/components/inbox-request-dialog";
import { CrmClientRequestDetailsParts } from "@/modules/crm-settings/inbox/components/CrmClientRequestDetailsParts";

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

  if (!row) {
    return null;
  }

  return (
    <CrmClientRequestDetailsParts
      row={row}
      onAccept={onAccept}
      onReject={onReject}
      onClose={onClose}
      actionPending={actionPending}
      canRespond={canRespond}
      canUpdateStatus={canUpdateStatus}
    >
      {({ fileViewer, main, sidebar }) => (
        <>
          {fileViewer}
          <InboxRequestDetailDialog
            open={open && !!row}
            onClose={onClose}
            title={t("dialogTitle")}
            subtitle={tClient("clientRequests.inbox.dialogSubtitle")}
            closeAriaLabel={t("closeDialog")}
            main={main}
            sidebar={sidebar}
          />
        </>
      )}
    </CrmClientRequestDetailsParts>
  );
}
