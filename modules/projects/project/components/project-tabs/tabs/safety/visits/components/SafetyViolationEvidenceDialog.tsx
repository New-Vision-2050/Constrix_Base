"use client";

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import {
  getSafetyViolationWeightLabel,
  isImageEvidence,
  type SafetyViolation,
} from "../types";

type SafetyViolationEvidenceDialogProps = {
  open: boolean;
  onClose: () => void;
  violation: SafetyViolation | null;
  workOrderNumber?: string;
};

export default function SafetyViolationEvidenceDialog({
  open,
  onClose,
  violation,
  workOrderNumber,
}: SafetyViolationEvidenceDialogProps) {
  const t = useTranslations("project.safetyTab.visits.evidenceDialog");

  const images = violation?.evidence.filter(isImageEvidence) ?? [];
  const statusLabel = violation
    ? getSafetyViolationWeightLabel(violation.weight)
    : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" fontWeight={700}>
            {t("title")}
          </Typography>
          {violation ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {violation.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {violation.code}
                {workOrderNumber ? ` · ${workOrderNumber}` : ""}
                {statusLabel ? ` · ${statusLabel}` : ""}
              </Typography>
            </>
          ) : null}
        </Box>
        <IconButton onClick={onClose} aria-label={t("close")}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {images.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
            {t("empty")}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 2,
            }}
          >
            {images.map((item) => (
              <Box
                key={item.id}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  component="img"
                  src={item.url}
                  alt={item.name || item.fileName}
                  sx={{
                    display: "block",
                    width: "100%",
                    height: 180,
                    objectFit: "contain",
                    bgcolor: "action.hover",
                  }}
                />
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {item.name || item.fileName}
                  </Typography>
                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="caption"
                    sx={{ display: "inline-block", mt: 0.5 }}
                  >
                    {t("openFullSize")}
                  </Link>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
