"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TableBuilder } from "@/modules/table";
import { useCommunicationMessagesTableConfig } from "../config/table-config";
import ReplyMessageDialog from "./ReplyMessageDialog";
import MessageDetailsDialog from "./MessageDetailsDialog";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

/**
 * Communication messages table component
 * - Displays all contact messages in a table
 * - Actions: Reply, View Details, Delete
 * - Supports RTL/LTR and Light/Dark modes
 */
export default function CommunicationMessagesTable() {
  const t = useTranslations("content-management-system.communicationMessages");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [viewingDetailsId, setViewingDetailsId] = useState<string | null>(null);

  const tableConfig = useCommunicationMessagesTableConfig({
    onReply: (id) => setReplyingToId(id),
    onViewDetails: (id) => setViewingDetailsId(id),
  });

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Can check={[PERMISSIONS.CMS.communicationContactMessages.list]}>
          <TableBuilder config={tableConfig} />
        </Can>
      </div>

      {/* Reply dialog */}
      <Can check={[PERMISSIONS.CMS.communicationContactMessages.update]}>
        <ReplyMessageDialog
          messageId={replyingToId}
          open={Boolean(replyingToId)}
          onClose={() => setReplyingToId(null)}
        />
      </Can>



      {/* Details dialog */}
      <Can check={[PERMISSIONS.CMS.communicationContactMessages.list]}>
        <MessageDetailsDialog
          messageId={viewingDetailsId}
          open={Boolean(viewingDetailsId)}
          onClose={() => setViewingDetailsId(null)}
        />
      </Can>
    </>
  );
}

