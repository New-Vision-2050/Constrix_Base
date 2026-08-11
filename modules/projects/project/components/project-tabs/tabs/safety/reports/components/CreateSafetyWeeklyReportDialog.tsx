"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";

type CreateSafetyWeeklyReportDialogProps = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (range: { fromDate: string; toDate: string }) => Promise<void> | void;
};

export default function CreateSafetyWeeklyReportDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: CreateSafetyWeeklyReportDialogProps) {
  const t = useTranslations("project.safetyTab.weeklyReports.createDialog");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (!open) {
      setFromDate("");
      setToDate("");
    }
  }, [open]);

  const canSubmit = Boolean(fromDate && toDate && fromDate <= toDate);

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    await onSubmit({ fromDate, toDate });
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            type="date"
            label={t("startDate")}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            fullWidth
            size="small"
            disabled={loading}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: toDate || undefined },
            }}
          />
          <TextField
            type="date"
            label={t("endDate")}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            fullWidth
            size="small"
            disabled={loading}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: fromDate || undefined },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {t("cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
        >
          {loading ? t("creating") : t("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
