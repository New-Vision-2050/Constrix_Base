"use client";

import { useMemo, useState } from "react";
import { Box, Button, MenuItem, Stack } from "@mui/material";
import { ArrowDownUp, EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import type { ProjectShareRow } from "./types";
import ShareProjectDialog from "./components/ShareProjectDialog";

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_SHARE: ProjectShareRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  companyName: "نيو فيجن",
  email: "example@gmail.com",
  mobile: "0112233434334",
  representative: "محمد أحمد",
  status: "pending",
}));

// ============================================================================
// Table
// ============================================================================

const ShareTableLayout = HeadlessTableLayout<ProjectShareRow>("project-share");

export default function ShareTab() {
  const t = useTranslations("project.share");
  const tProject = useTranslations("project");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const params = ShareTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const data = useMemo(() => MOCK_SHARE, []);
  const totalPages = 1;
  const totalItems = 10;

  const columns = useMemo(
    () => [
      {
        key: "companyName",
        name: t("companyName"),
        sortable: true,
        render: (row: ProjectShareRow) => <span>{row.companyName}</span>,
      },
      {
        key: "email",
        name: t("email"),
        sortable: false,
        render: (row: ProjectShareRow) => <span>{row.email}</span>,
      },
      {
        key: "mobile",
        name: t("mobile"),
        sortable: false,
        render: (row: ProjectShareRow) => <span>{row.mobile}</span>,
      },
      {
        key: "representative",
        name: t("companyRepresentative"),
        sortable: false,
        render: (row: ProjectShareRow) => <span>{row.representative}</span>,
      },
      {
        key: "status",
        name: t("requestStatus"),
        sortable: false,
        render: (row: ProjectShareRow) => (
          <span>
            {row.status === "pending" ? t("statusPending") : tProject("emptyCell")}
          </span>
        ),
      },
      {
        key: "actions",
        name: t("columnActions"),
        sortable: false,
        render: () => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="info"
                onClick={onClick}
              >
                {t("actionMenu")}
              </Button>
            )}
          >
            <MenuItem onClick={() => {}}>
              <EditIcon className="w-4 h-4 ml-2" />
              {t("edit")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [t, tProject],
  );

  const state = ShareTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: ProjectShareRow) => row.id,
    loading: false,
    searchable: true,
    onExport: async () => {
      // TODO: export selected rows
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <ShareTableLayout
        filters={
          <ShareTableLayout.TopActions
            state={state}
            searchComponent={
              state.table.searchable ? (
                <ShareTableLayout.Search
                  search={state.search}
                  placeholder={t("searchTypePlaceholder")}
                />
              ) : undefined
            }
            customActions={
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<ArrowDownUp className="h-4 w-4" />}
                  onClick={() => params.handleSort("companyName")}
                >
                  {t("sort")}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShareDialogOpen(true)}
                >
                  {t("add")}
                </Button>
              </Stack>
            }
          />
        }
        table={
          <ShareTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<ShareTableLayout.Pagination state={state} />}
      />
      <ShareProjectDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
      />
    </Box>
  );
}
