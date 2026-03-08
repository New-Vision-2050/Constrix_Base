"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ClientRequestRow } from "@/services/api/client-requests/types/response";
import OfferStatusChip from "./OfferStatusChip";
import Link from "next/link";
import { truncateFileName } from "./index";

interface OfferDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  row: ClientRequestRow | null;
}

export default function OfferDetailsDialog({
  open,
  onClose,
  row,
}: OfferDetailsDialogProps) {
  const t = useTranslations("pricesOffers.table");

  if (!row) return null;

  const formatDate = (dateStr: string | null | undefined) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "—";

  const gridItems = [
    { label: t("referenceNumber"), value: row.serial_number },
    { label: t("offerName"), value: row.content ?? "—" },
    { label: t("clientName"), value: row.client?.name ?? "—" },
    { label: t("clientEmail"), value: row.client?.email ?? "—" },
    { label: t("clientPhone"), value: row.client?.phone ?? "—" },
    { label: t("clientType"), value: row.client_type === "individual" ? t("clientTypeIndividual") : t("clientTypeCompany") },
    { label: t("management"), value: row.management?.name ?? "—" },
    { label: t("department"), value: row.branch?.name ?? "—" },
    { label: t("financialResponsible"), value: row.financial_responsible?.name ?? "—" },
    { label: t("offerStatus"), value: null, render: row.client_price_offer_status ? <OfferStatusChip status={row.client_price_offer_status} /> : "—" },
    { label: t("mediator"), value: row.management?.name ?? "—" },
    { label: t("requestType"), value: row.client_request_type?.name ?? "—" },
    {
      label: t("services"),
      value: row.services?.length ? row.services.map((s) => s.name).join(", ") : "—",
    },
    {
      label: t("attachments"),
      value: row.attachments?.length ? `${row.attachments.length}` : "—",
      render: row.attachments?.length ? (
        <span className="flex flex-col items-start gap-2">
          {row.attachments?.map((attachment) => (
            <span key={attachment.id} className="flex items-start text-sm gap-2">
              <FileText className="w-5 h-5 text-red-500" />
              <Tooltip title={attachment.name ?? "—"} key={attachment.id}>
                <Link href={attachment.url ?? "—"} target="_blank" className="text-sm">{truncateFileName(attachment.name ?? "—", 20)}</Link>
              </Tooltip>
            </span>
          ))}
        </span>
      ) : undefined,
    },
    { label: t("createdDate"), value: formatDate(row.created_at) },
    { label: t("updatedDate"), value: formatDate(row.updated_at) },
    { label: t("statusClientRequest"), value: row.status_client_request ?? "—" },
    { label: t("id"), value: row.id },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 16,
          top: 16,
          zIndex: 1,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle className="text-center">{t("viewDetails")}</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
            mt: 2,
          }}
        >
          {gridItems.map((item) => (
            <Box key={item.label}>
              <Typography variant="subtitle2" color="text.secondary">
                {item.label}
              </Typography>
              <span className="text-sm">{item.render ?? item.value}</span>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
