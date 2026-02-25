import { useTranslations } from "next-intl";
import { PriceOffer } from "./types";
import { Chip } from "@mui/material";

export default function OfferStatusChip({ status }: { status: PriceOffer["offerStatus"] }) {
    const t = useTranslations("pricesOffers.table");
    const config = {
      accepted: { label: t("accepted"), color: "success" as const },
      pending: { label: t("pending"), color: "warning" as const },
      rejected: { label: t("rejected"), color: "error" as const },
      draft: { label: "مسودة", color: "default" as const },
    };
    const { label, color } = config[status] ?? config.draft;
    return <Chip label={label} color={color} size="small" />;
  }