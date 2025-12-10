import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "../components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface AboutUsRow {
  id: string;
  url: string;
  image?: {
    url: string;
  };
  title: string;
  is_active: boolean;
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useAboutUsTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const { can } = usePermissions();
  const t = useTranslations("pagesSettings");
  const tCommon = useTranslations("labels");

  return {
    tableId: "about-us-list-table",
    url: `${baseURL}/ecommerce/dashboard/banners?type=about_us`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/banners`,
    columns: [
      {
        key: "image",
        label: t("table.image"),
        sortable: false,
        render: (_: unknown, row: AboutUsRow) => (
          <div className="flex ">
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
        label: t("table.title"),
        sortable: false,
        render: (_: unknown, row: AboutUsRow) => (
          <span className="text-sm font-medium">{row.title || "-"}</span>
        ),
      },
      {
        key: "url",
        label: t("table.url"),
        sortable: false,
        render: (_: unknown, row: AboutUsRow) => (
          <span className="text-sm truncate max-w-xs block">
            {row.url || "-"}
          </span>
        ),
      },
      {
        key: "is_active",
        label: t("table.status"),
        render: (value: "active" | "inActive", row: AboutUsRow) => (
          <TheStatus disabled={!can(PERMISSIONS.ecommerce.banner.activate)} theStatus={value} id={row.id} type="about-us" />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem disabled={!can(PERMISSIONS.ecommerce.banner.update)} onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {tCommon("edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.ecommerce.banner.delete),
    },
  };
};
