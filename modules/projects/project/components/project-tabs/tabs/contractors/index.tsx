"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography,
} from "@mui/material";
import { EditIcon, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useDebouncedValue } from "@/modules/table/hooks/useDebounce";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { ProjectContractorsApi } from "@/services/api/projects/project-contractors";
import {
  projectContractorsQueryKey,
  useProjectContractors,
} from "@/modules/projects/project/query/useProjectContractors";
import AddContractorDialog from "./add-contractor/AddContractorDialog";
import type { ContractorRow } from "./types";

const SEARCH_DEBOUNCE_MS = 400;

function contractorStatusColor(status: ContractorRow["status"]): string {
  return status === "active" ? "success.main" : "text.secondary";
}

const ContractorsTableLayout = HeadlessTableLayout<ContractorRow>("contractors");

export default function ContractorsTab() {
  const { projectId } = useProject();
  const queryClient = useQueryClient();
  const t = useTranslations("project.contractorsTab");
  const tTable = useTranslations("project.contractorsTab.table");
  const tStatus = useTranslations("project.contractorsTab.status");
  const tCommon = useTranslations("common");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [contractorToEdit, setContractorToEdit] = useState<ContractorRow | null>(
    null,
  );
  const [contractorToDelete, setContractorToDelete] =
    useState<ContractorRow | null>(null);

  const params = ContractorsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });
  const debouncedSearch = useDebouncedValue(params.search.trim(), SEARCH_DEBOUNCE_MS);
  const emptyDash = t("emptyDash");

  const contractorsQuery = useProjectContractors(projectId, {
    search: debouncedSearch,
  });

  const deleteMutation = useMutation({
    mutationFn: async (contractorId: string) => {
      if (!projectId) throw new Error("Missing project ID");
      return ProjectContractorsApi.deleteFromProject(projectId, contractorId);
    },
    onSuccess: (res) => {
      setContractorToDelete(null);
      toast.success(res.data?.message ?? t("deleteSuccess"));
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: projectContractorsQueryKey(projectId),
        });
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message ?? t("deleteError"));
    },
  });

  const allRows = useMemo(
    () => contractorsQuery.data ?? [],
    [contractorsQuery.data],
  );

  const totalItems = allRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return allRows.slice(start, start + params.limit);
  }, [allRows, params.page, params.limit]);

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: tTable("name"),
        sortable: false,
        render: (row: ContractorRow) => (
          <span>{row.name.trim() ? row.name : emptyDash}</span>
        ),
      },
      {
        key: "type",
        name: tTable("type"),
        sortable: false,
        render: (row: ContractorRow) => (
          <span>{row.type.trim() ? row.type : emptyDash}</span>
        ),
      },
      {
        key: "commercialRegister",
        name: tTable("commercialRegister"),
        sortable: false,
        render: (row: ContractorRow) => (
          <span>
            {row.commercialRegister.trim() ? row.commercialRegister : emptyDash}
          </span>
        ),
      },
      {
        key: "taxId",
        name: tTable("taxId"),
        sortable: false,
        render: (row: ContractorRow) => (
          <span>{row.taxId.trim() ? row.taxId : emptyDash}</span>
        ),
      },
      {
        key: "mobile",
        name: tTable("mobile"),
        sortable: false,
        render: (row: ContractorRow) => (
          <span>{row.mobile.trim() ? row.mobile : emptyDash}</span>
        ),
      },
      {
        key: "email",
        name: tTable("email"),
        sortable: false,
        render: (row: ContractorRow) => (
          <span>{row.email.trim() ? row.email : emptyDash}</span>
        ),
      },
      {
        key: "primaryContact",
        name: tTable("primaryContact"),
        sortable: false,
        render: (row: ContractorRow) => (
          <span>
            {row.primaryContact.trim() ? row.primaryContact : emptyDash}
          </span>
        ),
      },
      {
        key: "classification",
        name: tTable("classification"),
        sortable: false,
        render: (row: ContractorRow) => (
          <span>
            {row.classification.trim() ? row.classification : emptyDash}
          </span>
        ),
      },
      {
        key: "status",
        name: tTable("status"),
        sortable: false,
        render: (row: ContractorRow) => (
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: contractorStatusColor(row.status),
              fontWeight: 600,
            }}
          >
            {row.status === "active" ? tStatus("active") : tStatus("inactive")}
          </Typography>
        ),
      },
      {
        key: "actions",
        name: tTable("actions"),
        sortable: false,
        render: (row: ContractorRow) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                {tTable("action")}
              </Button>
            )}
          >
            <MenuItem
              onClick={() => {
                setContractorToEdit(row);
              }}
            >
              <EditIcon className="w-4 h-4 me-2" />
              {tTable("edit")}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setContractorToDelete(row);
              }}
              disabled={deleteMutation.isPending}
              sx={{ color: "error.main" }}
            >
              <Trash2 className="w-4 h-4 me-2" />
              {tTable("delete")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [tTable, tStatus, emptyDash, deleteMutation.isPending],
  );

  const state = ContractorsTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ContractorRow) => row.id,
    loading: contractorsQuery.isLoading,
    searchable: true,
    filtered: debouncedSearch.length > 0,
    onExport: async () => {
      // TODO: export when API is available
    },
  });

  if (!projectId) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {contractorsQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
        </Alert>
      ) : null}

      <ContractorsTableLayout
        filters={
          <ContractorsTableLayout.TopActions
            state={state}
            searchComponent={
              state.table.searchable ? (
                <ContractorsTableLayout.Search
                  search={state.search}
                  placeholder={t("searchPlaceholder")}
                />
              ) : undefined
            }
            customActions={
              <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
                {t("addContractor")}
              </Button>
            }
          />
        }
        table={
          <ContractorsTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<ContractorsTableLayout.Pagination state={state} />}
      />

      <AddContractorDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />

      <AddContractorDialog
        open={contractorToEdit != null}
        contractorId={contractorToEdit?.id ?? null}
        onClose={() => setContractorToEdit(null)}
      />

      <Dialog
        open={contractorToDelete != null}
        onClose={() => {
          if (!deleteMutation.isPending) setContractorToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t("deleteConfirmMessage")}
          </Typography>
          {contractorToDelete?.name ? (
            <Typography variant="subtitle2" fontWeight={700}>
              {contractorToDelete.name}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setContractorToDelete(null)}
            disabled={deleteMutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending || !contractorToDelete}
            onClick={() => {
              if (contractorToDelete) {
                deleteMutation.mutate(contractorToDelete.id);
              }
            }}
          >
            {tTable("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
