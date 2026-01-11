"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CommunicationMessagesApi } from "@/services/api/company-dashboard/communication-messages";
import { toast } from "sonner";
import Can from "@/lib/permissions/client/Can";
import { createColumns } from "./table-v2/columns";
import { TableFilters } from "./table-v2/filters";
import { RowActions } from "./table-v2/actions";
import { useTableData } from "./table-v2/use-table-data";
import ReplyMessageDialog from "./ReplyMessageDialog";
import MessageDetailsDialog from "./MessageDetailsDialog";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import { CommunicationMessage } from "../types";

// Create typed table instance
const MessageTable = HeadlessTableLayout<CommunicationMessage>();

/**
 * Communication Messages Table V2 - HeadlessTable Implementation
 * Migrated from old TableBuilder for better performance
 * Features: Search, Status Filter, Pagination, CRUD operations
 */
export default function CommunicationMessagesTableV2() {
  const { can } = usePermissions();
  const t = useTranslations("content-management-system.communicationMessages");

  // Dialog states
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [viewingDetailsId, setViewingDetailsId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = MessageTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // ✅ STEP 2: Fetch data using custom hook
  const {
    messages,
    isLoading,
    totalPages,
    totalItems,
    refetch,
  } = useTableData(params.page, params.limit, searchQuery, statusFilter);

  // Permission checks
  const canView = can(PERMISSIONS.CMS.communicationContactMessages.list);
  const canReply = can(PERMISSIONS.CMS.communicationContactMessages.update);
  const canDelete = can(PERMISSIONS.CMS.communicationContactMessages.delete);

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await CommunicationMessagesApi.delete(deleteConfirmId);
      toast.success(t("deleteSuccess"));
      setDeleteConfirmId(null);
      refetch();
    } catch {
      toast.error(t("deleteError"));
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Filter handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    params.setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    params.setPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    params.reset();
  };

  // Table columns with actions
  const columns = [
    ...createColumns(t),
    {
      key: "actions",
      name: t("actions"),
      sortable: false,
      render: (row: CommunicationMessage) => (
        <RowActions
          row={row}
          onViewDetails={setViewingDetailsId}
          onReply={setReplyingToId}
          onDelete={handleDeleteClick}
          canView={canView}
          canReply={canReply}
          canDelete={canDelete}
          t={t}
        />
      ),
    },
  ];

  // ✅ STEP 3: useTableState (AFTER query)
  const state = MessageTable.useTableState({
    data: messages,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (msg) => msg.id,
    loading: isLoading,
    filtered: searchQuery !== "" || statusFilter !== "all",
  });

  return (
    <Can check={[PERMISSIONS.CMS.communicationContactMessages.list]}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>

        <MessageTable
          filters={
            <TableFilters
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusChange}
              onReset={handleReset}
              t={t}
            />
          }
          table={
            <MessageTable.Table state={state} loadingOptions={{ rows: 5 }} />
          }
          pagination={<MessageTable.Pagination state={state} />}
        />
      </div>

      {/* Dialogs */}
      <Can check={[PERMISSIONS.CMS.communicationContactMessages.update]}>
        <ReplyMessageDialog
          messageId={replyingToId}
          open={Boolean(replyingToId)}
          onDialogSuccess={refetch}
          onClose={() => setReplyingToId(null)}
        />
      </Can>

      <Can check={[PERMISSIONS.CMS.communicationContactMessages.list]}>
        <MessageDetailsDialog
          messageId={viewingDetailsId}
          open={Boolean(viewingDetailsId)}
          onClose={() => setViewingDetailsId(null)}
        />
      </Can>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteConfirmId)}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title={t("deleteConfirmMessage")}
      />
    </Can>
  );
}
