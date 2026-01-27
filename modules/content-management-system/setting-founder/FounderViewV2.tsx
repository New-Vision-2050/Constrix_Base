"use client";

import React, { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CompanyDashboardFoundersApi } from "@/services/api/company-dashboard/founders";
import { toast } from "sonner";
import Can from "@/lib/permissions/client/Can";
import { Button } from "@/components/ui/button";
import { createColumns } from "./table-v2/columns";
import { RowActions } from "./table-v2/actions";
import AddFounderDialog from "./add-founder-dialog";
import ConfirmDeleteDialog from "@/modules/company-profile/components/official-data/official-docs-section/docs-settings-dialog/AddDocumentType/ConfirmDeleteDialog";
import { FounderRow } from "./types";
import { ListFoundersResponse } from "@/services/api/company-dashboard/founders/types/response";

// Create typed table instance
const FounderTable = HeadlessTableLayout<FounderRow>("csfd");

/**
 * Founder View V2 - HeadlessTable Implementation
 * Migrated from old TableBuilder for better performance
 * Features: Search, Pagination, CRUD operations
 */
export default function FounderViewV2() {
  const { can } = usePermissions();
  const tTable = useTranslations("content-management-system.founder.table");

  // Dialog states
  const [editingFounderId, setEditingFounderId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // ✅ STEP 1: useTableParams (BEFORE query)
  const params = FounderTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // ✅ STEP 2: Fetch data using useQuery directly
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["founders", params.page, params.limit, params.search],
    queryFn: async () => {
      const response = await CompanyDashboardFoundersApi.list({
        page: params.page,
        per_page: params.limit,
        search: params.search || undefined,
      });
      return response.data as ListFoundersResponse;
    },
  });

  // Extract data from response with proper typing
  const founders = useMemo<FounderRow[]>(
    () => (data?.payload || []) as unknown as FounderRow[],
    [data],
  );

  const totalPages = useMemo(() => data?.pagination?.last_page || 1, [data]);

  const totalItems = useMemo(() => data?.pagination?.result_count || 0, [data]);

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
    ...createColumns(tTable),
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

  // ✅ STEP 3: useTableState (AFTER query)
  const state = FounderTable.useTableState({
    data: founders,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (founder) => founder.id,
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <Can check={[PERMISSIONS.CMS.founder.list]}>
      <div className="px-8 space-y-4">
        <FounderTable
          filters={
            <FounderTable.TopActions
              state={state}
              customActions={
                <Can check={[PERMISSIONS.CMS.founder.create]}>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    {tTable("addFounder")}
                  </Button>
                </Can>
              }
            />
          }
          table={
            <FounderTable.Table state={state} loadingOptions={{ rows: 5 }} />
          }
          pagination={<FounderTable.Pagination state={state} />}
        />
      </div>

      {/* Add/Edit Dialog */}
      <Can
        check={[PERMISSIONS.CMS.founder.create, PERMISSIONS.CMS.founder.update]}
      >
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
