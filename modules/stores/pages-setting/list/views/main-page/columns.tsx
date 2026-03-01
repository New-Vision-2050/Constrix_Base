import TheStatus from "../../../components/the-status";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { MainPageRow } from "./types";

export const getMainPageColumns = (
  t: (key: string) => string,
  can: (permission: string) => boolean
) => [
  {
    key: "title",
    name: t("table.title"),
    sortable: false,
    render: (row: MainPageRow) => (
      <span className="text-sm font-medium">{row.title || "-"}</span>
    ),
  },
  {
    key: "url",
    name: t("table.url"),
    sortable: false,
    render: (row: MainPageRow) => (
      <span className="text-sm truncate max-w-xs block">{row.url || "-"}</span>
    ),
  },
  {
    key: "is_active",
    name: t("table.status"),
    sortable: false,
    render: (row: MainPageRow) => (
      <TheStatus
        disabled={!can(PERMISSIONS.ecommerce.banner.activate)}
        theStatus={row.is_active ? "active" : "inActive"}
        id={row.id}
        type="main"
      />
    ),
  },
];
