import { useTranslations } from "next-intl";
import { Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ClientRequestStatus } from "@/services/api/client-requests/types/response";

export default function OfferStatusChip({
  status,
  onPendingClick,
}: {
  status: ClientRequestStatus;
  onPendingClick?: () => void;
}) {
  const t = useTranslations("pricesOffers.table");
  const config = {
    accepted: { label: t("accepted"), color: "success" as const },
    pending: { label: t("pending"), color: "warning" as const },
    rejected: { label: t("rejected"), color: "error" as const },
    draft: { label: "مسودة", color: "default" as const },
  };
  const { label, color } =
    config[status as keyof typeof config] ?? config.draft;

  const isDefault = color === "default";
  const isPending = status === "pending";

  return (
    <Chip
      label={label}
      size="medium"
      variant="filled"
      onClick={isPending ? onPendingClick : undefined}
      sx={(theme) => ({
        ...(isDefault
          ? {
              bgcolor: alpha(theme.palette.grey[500], 0.2),
              color: theme.palette.grey[700],
            }
          : {
              bgcolor: alpha(theme.palette[color].main, 0.2),
              color: theme.palette[color].main,
              ...(isPending && {
                textDecoration: "underline",
                cursor: "pointer",
              }),
            }),
      })}
    />
  );
}
