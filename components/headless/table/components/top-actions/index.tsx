import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { FileDownload, Delete, ViewColumn } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { TableStateV2 as TableState } from "../table-state-v2/types";
import { ColumnVisibilityDialog } from "../column-visibility/ColumnVisibilityDialog";

// ============================================================================
// TopActions Component
// ============================================================================

export type TopActionsProps<TRow> = {
  state: TableState<TRow>;
  customActions?: React.ReactNode;
  searchComponent?: React.ReactNode;
  children?: React.ReactNode;
};

export function createTopActionsComponent<TRow>(
  SearchComponent: React.ComponentType<{
    search: {
      search: string;
      setSearch: (search: string) => void;
    };
    placeholder?: string;
  }>,
) {
  const TopActionsComponent = ({
    state,
    customActions,
    searchComponent,
    children,
  }: TopActionsProps<TRow>) => {
    const { actions, columnVisibility } = state;
    const t = useTranslations("Table");
    const [columnDialogOpen, setColumnDialogOpen] = useState(false);

    // Use provided searchComponent, or default Search if searchable
    const finalSearchComponent =
      searchComponent !== undefined ? (
        searchComponent
      ) : state.table.searchable ? (
        <SearchComponent search={state.search} />
      ) : null;

    return (
      <Stack spacing={2}>
        <Box>{children}</Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Box flexGrow={1}>{finalSearchComponent}</Box>
          <Stack direction="row" spacing={1}>
            {actions.onExport && (
              <div>
                <Button
                  variant="outlined"
                  startIcon={<FileDownload />}
                  onClick={actions.onExport}
                  disabled={!actions.canExport}
                  color="info"
                >
                  {t("Export")}
                </Button>
              </div>
            )}

            {actions.onDelete && (
              <div>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={actions.onDelete}
                  disabled={!actions.canDelete}
                >
                  {t("Delete")}
                </Button>
              </div>
            )}
            {customActions}
          </Stack>
          {columnVisibility && (
            <div>
              <Button
                variant="outlined"
                startIcon={<ViewColumn />}
                onClick={() => setColumnDialogOpen(true)}
              >
                {t("Columns")}
              </Button>
            </div>
          )}
        </Box>

        {columnVisibility && (
          <ColumnVisibilityDialog
            open={columnDialogOpen}
            onClose={() => setColumnDialogOpen(false)}
            columns={columnVisibility.allColumns}
            columnVisibility={columnVisibility.columnVisibility}
            toggleColumn={columnVisibility.toggleColumn}
            showAllColumns={columnVisibility.showAllColumns}
            hideAllColumns={columnVisibility.hideAllColumns}
            resetColumnVisibility={columnVisibility.resetColumnVisibility}
          />
        )}
      </Stack>
    );
  };

  return TopActionsComponent;
}
