"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { TableBuilder } from "@/modules/table";
import { useCommunicationMessagesTableConfig } from "../config/table-config";
import ReplyMessageDialog from "./ReplyMessageDialog";
import MessageDetailsDialog from "./MessageDetailsDialog";

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
        <TableBuilder config={tableConfig} />
      </div>

      {/* Reply dialog */}
      <ReplyMessageDialog
        messageId={replyingToId}
        open={Boolean(replyingToId)}
        onClose={() => setReplyingToId(null)}
      />

      {/* Details dialog */}
      <MessageDetailsDialog
        messageId={viewingDetailsId}
        open={Boolean(viewingDetailsId)}
        onClose={() => setViewingDetailsId(null)}
      />
    </>
  );
}

