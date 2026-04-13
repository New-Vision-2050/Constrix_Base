"use client";

import type { ReactNode } from "react";
import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import { inboxRequestDialogCardSx } from "./inbox-dialog-styles";

export type InboxRequestApprovalPathCardProps = {
  title: ReactNode;
  children: ReactNode;
};

export function InboxRequestApprovalPathCard({
  title,
  children,
}: InboxRequestApprovalPathCardProps) {
  return (
    <Box>
      <Paper variant="outlined" sx={{ ...inboxRequestDialogCardSx, p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          {title}
        </Typography>
        {children}
      </Paper>
    </Box>
  );
}

export type InboxRequestCommentsFieldProps = {
  sectionTitle: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
};

export function InboxRequestCommentsField({
  sectionTitle,
  value,
  onChange,
  placeholder,
  disabled,
}: InboxRequestCommentsFieldProps) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        {sectionTitle}
      </Typography>
      <Paper variant="outlined" sx={{ ...inboxRequestDialogCardSx, p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "primary.dark",
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              size="small"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
