import TheStatus from "../../../../components/the-status";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { FeaturesRow } from "../types/features-types";

export const getFeaturesColumns = (
  t: (key: string) => string,
  can: (permission: string) => boolean,
) => [
  {
    key: "title",
    name: t("table.title"),
    sortable: false,
    render: (row: FeaturesRow) => (
      <span className="text-sm font-medium">{row.title || "-"}</span>
    ),
  },
  {
    key: "description",
    name: t("table.description"),
    sortable: false,
    render: (row: FeaturesRow) => (
      <span className="text-sm truncate max-w-xs block">
        {row.description || "-"}
      </span>
    ),
  },
  {
    key: "is_active",
    name: t("table.status"),
    sortable: false,
    render: (row: FeaturesRow) => (
      <TheStatus
        disabled={!can(PERMISSIONS.ecommerce.banner.activate)}
        theStatus={row.is_active ? "active" : "inActive"}
        id={row.id}
        type="contact"
      />
    ),
  },
];
