import { AboutUsRow } from "./types";
import Image from "next/image";
import TheStatus from "../../../components/the-status";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const getAboutUsColumns = (
  t: (key: string) => string,
  can: (permission: string) => boolean
) => [
  {
    key: "image",
    name: t("table.image"),
    sortable: false,
    render: (row: AboutUsRow) => (
      <div className="flex">
        {row.image?.url ? (
          <Image
            src={row.image.url}
            alt={row.title || "Banner"}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
            {t("table.noImage")}
          </div>
        )}
      </div>
    ),
  },
  {
    key: "title",
    name: t("table.title"),
    sortable: false,
    render: (row: AboutUsRow) => (
      <span className="text-sm font-medium">{row.title || "-"}</span>
    ),
  },
  {
    key: "url",
    name: t("table.url"),
    sortable: false,
    render: (row: AboutUsRow) => (
      <span className="text-sm truncate max-w-xs block">{row.url || "-"}</span>
    ),
  },
  {
    key: "is_active",
    name: t("table.status"),
    sortable: false,
    render: (row: AboutUsRow) => (
      <TheStatus
        disabled={!can(PERMISSIONS.ecommerce.banner.activate)}
        theStatus={row.is_active ? "active" : "inActive"}
        id={row.id}
        type="about-us"
      />
    ),
  },
];
