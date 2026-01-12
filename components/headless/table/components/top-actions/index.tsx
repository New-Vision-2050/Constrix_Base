import React from "react";
import { Box, Button, Stack, Typography, Chip } from "@mui/material";
import { FileDownload, Delete } from "@mui/icons-material";
import { TableState } from "../table-state/types";

// ============================================================================
// TopActions Component
// ============================================================================

export type TopActionsProps<TRow> = {
  state: TableState<TRow>;
  customActions?: React.ReactNode;
};

export function createTopActionsComponent<TRow>() {
  const TopActionsComponent = ({
    state,
    customActions,
  }: TopActionsProps<TRow>) => {
    const { selection, actions } = state;

    if (!selection.hasSelection && !customActions) {
      return null;
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {selection.hasSelection && (
              <>
                <Typography variant="body2" color="text.secondary">
                  <Chip
                    label={`${selection.selectedCount} selected`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Typography>
                <Button
                  size="small"
                  onClick={selection.clearSelection}
                  variant="outlined"
                >
                  Clear Selection
                </Button>
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            {customActions}

            {actions.onExport && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={actions.onExport}
                disabled={!actions.canExport}
              >
                Export
              </Button>
            )}

            {actions.onDelete && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={actions.onDelete}
                disabled={!actions.canDelete}
              >
                Delete
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    );
  };

  return TopActionsComponent;
}
