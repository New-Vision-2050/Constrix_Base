"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CompanyDashboardFoundersApi } from "@/services/api/company-dashboard/founders";
import { toast } from "sonner";
import Can from "@/lib/permissions/client/Can";
import { Button } from "@/components/ui/button";
import { createColumns } from "./table-v2/columns";
import { TableFilters } from "./table-v2/filters";
import { RowActions } from "./table-v2/actions";
import { useTableData } from "./table-v2/use-table-data";
import AddFounderDialog from "./add-founder-dialog";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import { FounderRow } from "./types";

// Create typed table instance
const FounderTable = HeadlessTableLayout<FounderRow>();

/**
 * Founder View V2 - HeadlessTable Implementation
 * Migrated from old TableBuilder for better performance
 * Features: Search, Pagination, CRUD operations
 */
export default function FounderViewV2() {
  const { can } = usePermissions();
  const t = useTranslations("content-management-system.founder");
  const tTable = useTranslations("content-management-system.founder.table");
  const locale = useLocale();

  // Dialog states
  const [editingFounderId, setEditingFounderId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Table data and filters
  const {
    founders,
    isLoading,
    page,
    limit,
    totalPages,
    totalItems,
    searchQuery,
    setPage,
    setLimit,
    handleSearchChange,
    handleReset,
    refetch,
  } = useTableData();

  // Permission checks
  const canEdit = can(PERMISSIONS.CMS.founder.update);
  const canDelete = can(PERMISSIONS.CMS.founder.delete);
  const canCreate = can(PERMISSIONS.CMS.founder.create);

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await CompanyDashboardFoundersApi.delete(deleteConfirmId);
      toast.success(tTable("deleteSuccess"));
      setDeleteConfirmId(null);
      refetch();
    } catch {
      toast.error(tTable("deleteError"));
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Table columns with actions
  const columns = [
    ...createColumns(tTable, locale),
    {
      key: "actions",
      name: tTable("actions"),
      sortable: false,
      render: (row: FounderRow) => (
        <RowActions
          row={row}
          onEdit={setEditingFounderId}
          onDelete={handleDeleteClick}
          canEdit={canEdit}
          canDelete={canDelete}
          t={tTable}
        />
      ),
    },
  ];

  // Initialize table state with server-side pagination
  const state = FounderTable.useState({
    data: founders,
    columns,
    pagination: {
      page,
      limit,
      totalPages,
      totalItems,
    },
    getRowId: (founder) => founder.id,
    loading: isLoading,
    filtered: searchQuery !== "",
  });

  // Sync pagination changes with API state
  React.useEffect(() => {
    if (state.pagination.page !== page) {
      setPage(state.pagination.page);
    }
  }, [state.pagination.page, page, setPage]);

  React.useEffect(() => {
    if (state.pagination.limit !== limit) {
      setLimit(state.pagination.limit);
    }
  }, [state.pagination.limit, limit, setLimit]);

  return (
    <Can check={[PERMISSIONS.CMS.founder.list]}>
      <div className="px-8 space-y-4">
        {/* Title and Add Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Can check={[PERMISSIONS.CMS.founder.create]}>
            <Button onClick={() => setAddDialogOpen(true)}>
              {t("addFounder")}
            </Button>
          </Can>
        </div>

        <FounderTable
          filters={
            <TableFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onReset={handleReset}
              t={tTable}
            />
          }
          table={<FounderTable.Table state={state} loadingOptions={{ rows: 5 }} />}
          pagination={<FounderTable.Pagination state={state} />}
        />
      </div>

      {/* Add/Edit Dialog */}
      <Can check={[PERMISSIONS.CMS.founder.create, PERMISSIONS.CMS.founder.update]}>
        <AddFounderDialog
          open={addDialogOpen || Boolean(editingFounderId)}
          onClose={() => {
            setAddDialogOpen(false);
            setEditingFounderId(null);
          }}
          founderId={editingFounderId || undefined}
          onSuccess={() => {
            refetch();
            setAddDialogOpen(false);
            setEditingFounderId(null);
          }}
        />
      </Can>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteConfirmId)}
        onConfirm={confirmDelete}
        onClose={cancelDelete}
        title={tTable("deleteConfirmMessage")}
      />
    </Can>
  );
}
