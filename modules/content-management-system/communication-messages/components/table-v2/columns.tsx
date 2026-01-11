import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@/components/headless/table";
import { CommunicationMessage } from "../../types";

/**
 * Table columns configuration for communication messages
 * Defines how each column should be displayed and sorted
 */
export const createColumns = (t: (key: string) => string): ColumnDef<CommunicationMessage>[] => [
  {
    key: "name",
    name: t("name"),
    sortable: true,
    render: (row) => <strong className="text-sm">{row.name}</strong>,
  },
  {
    key: "email",
    name: t("email"),
    sortable: true,
    render: (row) => (
      <a
        href={`mailto:${row.email}`}
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        {row.email}
      </a>
    ),
  },
  {
    key: "phone",
    name: t("phone"),
    sortable: false,
    render: (row) => <span className="text-sm">{row.phone}</span>,
  },
  {
    key: "address",
    name: t("address"),
    sortable: false,
    render: (row) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {row.address || "-"}
      </span>
    ),
  },
  {
    key: "status",
    name: t("status"),
    sortable: true,
    render: (row) => {
      const statusText = row.status === 1 ? t("replied") : t("pending");
      const statusColor = row.status === 1 ? "default" : "secondary";
      return (
        <Badge variant={statusColor} className="text-xs">
          {statusText}
        </Badge>
      );
    },
  },
  {
    key: "message",
    name: t("message"),
    sortable: false,
    render: (row) => (
      <span className="text-sm line-clamp-2 max-w-xs">
        {row.message}
      </span>
    ),
  },
];
