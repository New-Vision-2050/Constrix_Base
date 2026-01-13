import { Address } from "@/services/api/company-dashboard/communication-settings/types/response";
import { truncateString } from "@/utils/truncate-string";

export const getAddressColumns = (t: (key: string) => string) => [
  {
    key: "title",
    name: t("table.name") || "Address",
    sortable: true,
    render: (row: Address) => <strong>{row.title}</strong>,
  },
  {
    key: "address",
    name: t("table.address") || "Address",
    sortable: true,
    render: (row: Address) => (
      <span>{truncateString(row.address ?? "-", 30)}</span>
    ),
  },
  {
    key: "latitude",
    name: t("table.latitude") || "Latitude",
    sortable: true,
    render: (row: Address) => <span>{row.latitude}</span>,
  },
  {
    key: "longitude",
    name: t("table.longitude") || "Longitude",
    sortable: true,
    render: (row: Address) => <span>{row.longitude}</span>,
  },
];
