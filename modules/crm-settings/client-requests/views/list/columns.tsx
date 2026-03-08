import { ClientRequestRow } from "@/services/api/client-requests";
import { Chip } from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";

export type { ClientRequestRow };

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success";

const STATUS_STYLES: Record<string, { bg: ChipColor }> = {
  pending: { bg: "warning" },
  accepted: { bg: "success" },
  rejected: { bg: "error" },
  default: { bg: "info" },
};

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations();
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.default;
  
  // Get translated status text
  const getTranslatedStatus = (statusKey: string) => {
    try {
      return t(`clientRequests.status.${statusKey}`);
    } catch {
      return statusKey;
    }
  };

  return (
    <Chip
      color={style.bg}
      label={getTranslatedStatus(status)}
      size="medium"
      sx={{ textTransform: "capitalize", color: "#000", fontWeight: 500 }}
    />
  );
}

export const getClientRequestsColumns = (t: (key: string) => string) => [
  {
    key: "id",
    name: t("clientRequests.table.serialNumber"),
    sortable: false,
    render: (row: ClientRequestRow) => (
      <span style={{ fontSize: 12, opacity: 0.7 }}>{row.serial_number}</span>
    ),
  },
  {
    key: "item_name",
    name: t("clientRequests.table.itemName"),
    sortable: false,
    render: (row: ClientRequestRow) => <span>{"—"}</span>,
  },
  {
    key: "client_request_receiver_from",
    name: t("clientRequests.table.source"),
    sortable: false,
    render: (row: ClientRequestRow) => (
      <span>{row.client_request_receiver_from?.name ?? "—"}</span>
    ),
  },
  {
    key: "created_at",
    name: t("clientRequests.table.requestDate"),
    sortable: true,
    render: (row: ClientRequestRow) => (
      <span>{row.created_at?.slice(0, 10) ?? "—"}</span>
    ),
  },
  {
    key: "client",
    name: t("clientRequests.table.customerData"),
    sortable: false,
    render: (row: ClientRequestRow) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.client?.name ?? "—"}</div>
      </div>
    ),
  },
  {
    key: "branch",
    name: t("clientRequests.table.branch"),
    sortable: false,
    render: (row: ClientRequestRow) => (
      <span>{row.branch?.name ?? "—"}</span>
    ),
  },
  {
    key: "client_request_type",
    name: t("clientRequests.table.requestType"),
    sortable: false,
    render: (row: ClientRequestRow) => (
      <span>{row.client_request_type?.name ?? "—"}</span>
    ),
  },
  {
    key: "status_client_request",
    name: t("clientRequests.table.requestStatus"),
    sortable: false,
    render: (row: ClientRequestRow) => (
      <StatusBadge status={row.status_client_request} />
    ),
  },
  {
    key: "management",
    name: t("clientRequests.table.assignedManagement"),
    sortable: false,
    render: (row: ClientRequestRow) => (
      <span>{row.management?.name ?? "—"}</span>
    ),
  },
];
