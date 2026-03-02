import React from "react";
import { CustomerRequestRow } from "@/services/api/customer-requests";

export type { CustomerRequestRow };

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

export const getCustomerRequestsColumns = (t: (key: string) => string) => [
  {
    key: "id",
    name: t("customerRequests.table.serialNumber"),
    sortable: false,
    render: (row: CustomerRequestRow) => (
      <span style={{ fontSize: 12, opacity: 0.7 }}>{row.serial_number}</span>
    ),
  },
  {
    key: "client",
    name: t("customerRequests.table.customerData"),
    sortable: false,
    render: (row: CustomerRequestRow) => (
      <div>
        <div style={{ fontWeight: 500 }}>{row.client?.name ?? "—"}</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          {row.client?.phone ?? ""}
        </div>
      </div>
    ),
  },
  {
    key: "created_at",
    name: t("customerRequests.table.requestDate"),
    sortable: true,
    render: (row: CustomerRequestRow) => (
      <span>{row.created_at?.slice(0, 10) ?? "—"}</span>
    ),
  },
  {
    key: "client_request_receiver_from",
    name: t("customerRequests.table.source"),
    sortable: false,
    render: (row: CustomerRequestRow) => (
      <span>{row.client_request_receiver_from?.name ?? "—"}</span>
    ),
  },
  {
    key: "client_request_type",
    name: t("customerRequests.table.requestType"),
    sortable: false,
    render: (row: CustomerRequestRow) => (
      <span>{row.client_request_type?.name ?? "—"}</span>
    ),
  },
  {
    key: "services",
    name: t("customerRequests.form.serviceName"),
    sortable: false,
    render: (row: CustomerRequestRow) => (
      <span>{row.services?.map((s) => s.name).join(", ") || "—"}</span>
    ),
  },
  {
    key: "branch",
    name: t("customerRequests.table.branch"),
    sortable: false,
    render: (row: CustomerRequestRow) => <span>{row.branch?.name ?? "—"}</span>,
  },
  {
    key: "status_client_request",
    name: t("customerRequests.table.requestStatus"),
    sortable: false,
    render: (row: CustomerRequestRow) => (
      <StatusBadge status={row.status_client_request} />
    ),
  },
  {
    key: "management",
    name: t("customerRequests.table.assignedManagement"),
    sortable: false,
    render: (row: CustomerRequestRow) => (
      <span>{row.management?.name ?? "—"}</span>
    ),
  },
];
