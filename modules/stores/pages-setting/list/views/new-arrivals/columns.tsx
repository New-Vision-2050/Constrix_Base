import TheStatus from "../../../components/the-status";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { NewArrivalsRow } from "./types";

export const getNewArrivalsColumns = (
  t: (key: string) => string,
  can: (permission: string) => boolean
) => [
  {
    key: "title",
    name: t("table.title"),
    sortable: false,
    render: (row: NewArrivalsRow) => (
      <span className="text-sm font-medium">{row.title || "-"}</span>
    ),
  },
  {
    key: "url",
    name: t("table.url"),
    sortable: false,
    render: (row: NewArrivalsRow) => (
      <span className="text-sm truncate max-w-xs block">{row.url || "-"}</span>
    ),
  },
  {
    key: "is_active",
    name: t("table.status"),
    sortable: false,
    render: (row: NewArrivalsRow) => (
      <TheStatus
        disabled={!can(PERMISSIONS.ecommerce.banner.activate)}
        theStatus={row.is_active ? "active" : "inActive"}
        id={row.id}
        type="new-arrivals"
      />
    ),
  },
];
