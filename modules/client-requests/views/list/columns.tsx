import { ClientRequestRow } from "@/services/api/client-requests";
import React from "react";

export type { ClientRequestRow };

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#4a5568", color: "#fff" },
  accepted: { bg: "#2d6a4f", color: "#fff" },
  rejected: { bg: "#c0392b", color: "#fff" },
  default: { bg: "#555", color: "#fff" },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.default;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        backgroundColor: style.bg,
        color: style.color,
        whiteSpace: "nowrap",
        display: "inline-block",
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
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
    render: (row: ClientRequestRow) => <span>{row.id || "—"}</span>,
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
    render: (row: ClientRequestRow) => <span>{row.branch?.name ?? "—"}</span>,
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
