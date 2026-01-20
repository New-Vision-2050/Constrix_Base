import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { FileDownload, Delete } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { TableStateV2 as TableState } from "../table-state-v2/types";
import { TableParams } from "../table-params/types";

// ============================================================================
// TopActions Component
// ============================================================================

export type TopActionsProps<TRow> = {
  state: TableState<TRow>;
  params?: TableParams;
  customActions?: React.ReactNode;
  searchComponent?: React.ReactNode;
  children?: React.ReactNode;
};

export function createTopActionsComponent<TRow>(
  SearchComponent: React.ComponentType<{
    params: TableParams;
    placeholder?: string;
  }>,
) {
  const TopActionsComponent = ({
    state,
    params,
    customActions,
    searchComponent,
    children,
  }: TopActionsProps<TRow>) => {
    const { actions } = state;
    const t = useTranslations("Table");

    // Use provided searchComponent, or default Search if searchable and params provided
    const finalSearchComponent =
      searchComponent !== undefined ? (
        searchComponent
      ) : state.table.searchable && params ? (
        <SearchComponent params={params} />
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
        </Box>
      </Stack>
    );
  };

  return TopActionsComponent;
}
