"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import type { CompanyData } from "@/services/api/projects/project-sharing/types/response";
import { markCompanyAsClient } from "@/modules/clients/apis/mark-company-as-client";
import { getErrorMessage } from "@/utils/errorHandler";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }
  return (
    <Stack direction="row" spacing={2} sx={{ py: 0.5, alignItems: "flex-start" }}>
      <Typography
        component="span"
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 120, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography component="span" variant="body2" sx={{ flex: 1 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function CompanyMarkClientPreviewDialog({
  open,
  company,
  onClose,
  onMarkedSuccess,
}: {
  open: boolean;
  company: CompanyData | null;
  onClose: () => void;
  onMarkedSuccess: () => void;
}) {
  const t = useTranslations("ClientsModule.form");
  const [marking, setMarking] = useState(false);

  const activityLabel = company?.company_field?.[0]?.name;

  const handleMark = async () => {
    if (!company?.id) return;
    setMarking(true);
    try {
      await markCompanyAsClient(company.id);
      toast.success(t("markAsClientSuccess"));
      onMarkedSuccess();
      onClose();
    } catch (err) {
      const apiMsg = axios.isAxiosError(err)
        ? getErrorMessage(err) ||
          (typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : null)
        : null;
      toast.error(apiMsg || t("markAsClientError"));
    } finally {
      setMarking(false);
    }
  };

  if (!company) return null;

  const displayName =
    company.name?.trim() ||
    company.name_ar?.trim() ||
    company.name_en?.trim() ||
    "—";

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!marking) onClose();
      }}
      maxWidth="sm"
      fullWidth
      aria-labelledby="company-preview-dialog-title"
    >
      <DialogTitle id="company-preview-dialog-title">
        {t("companyPreviewDialogTitle")}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={company.logo || undefined}
              alt=""
              variant="rounded"
              sx={{ width: 64, height: 64 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" component="div" noWrap title={displayName}>
                {displayName}
              </Typography>
              {company.serial_no ? (
                <Chip
                  label={company.serial_no}
                  size="small"
                  sx={{ mt: 1 }}
                  variant="outlined"
                />
              ) : null}
            </Box>
          </Stack>

          <Divider />

          <DetailRow label={t("previewEmail")} value={company.email} />
          <DetailRow label={t("previewPhone")} value={company.phone} />
          <DetailRow label={t("previewCountry")} value={company.country_name} />
          <DetailRow label={t("previewOwner")} value={company.owner_name} />
          <DetailRow
            label={t("previewGeneralManager")}
            value={company.general_manager?.name ?? undefined}
          />
          <DetailRow
            label={t("previewGmContact")}
            value={
              company.general_manager
                ? [company.general_manager.email, company.general_manager.phone]
                    .filter(Boolean)
                    .join(" · ")
                : undefined
            }
          />
          <DetailRow
            label={t("previewBranch")}
            value={company.main_branch?.name || company.branch}
          />
          <DetailRow label={t("previewActivity")} value={activityLabel} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={marking} variant="outlined" color="inherit">
          {t("companyPreviewClose")}
        </Button>
        <Button
          onClick={handleMark}
          variant="contained"
          disabled={marking}
        >
          {marking ? (
            <Stack direction="row" alignItems="center" gap={1}>
              <CircularProgress size={18} color="inherit" />
              {t("markAsClientLoading")}
            </Stack>
          ) : (
            t("companyPreviewMarkAsClient")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
