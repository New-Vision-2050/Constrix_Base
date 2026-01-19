import TheStatus from "../../../../components/the-status";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { BranchRow } from "../types/branch-types";

export const getBranchColumns = (
  t: (key: string) => string,
  can: (permission: string) => boolean
) => [
  {
    key: "name",
    name: t("table.name"),
    sortable: false,
    render: (row: BranchRow) => (
      <span className="text-sm font-medium">{row.name || "-"}</span>
    ),
  },
  {
    key: "address",
    name: t("table.address"),
    sortable: false,
    render: (row: BranchRow) => (
      <span className="text-sm truncate max-w-xs block">
        {row.address || "-"}
      </span>
    ),
  },
  {
    key: "phone",
    name: t("table.phone"),
    sortable: false,
    render: (row: BranchRow) => (
      <span className="text-sm">{row.phone || "-"}</span>
    ),
  },
  {
    key: "email",
    name: t("table.email"),
    sortable: false,
    render: (row: BranchRow) => (
      <span className="text-sm truncate max-w-xs block">
        {row.email || "-"}
      </span>
    ),
  },
  {
    key: "is_active",
    name: t("table.status"),
    sortable: false,
    render: (row: BranchRow) => (
      <TheStatus
        disabled={!can(PERMISSIONS.ecommerce.banner.activate)}
        theStatus={row.is_active ? "active" : "inActive"}
        id={row.id}
        type="contact"
      />
    ),
  },
];
