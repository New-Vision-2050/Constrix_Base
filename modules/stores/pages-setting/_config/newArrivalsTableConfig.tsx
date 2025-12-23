import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "../components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface NewArrivalsRow {
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

export const useNewArrivalsTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const { can } = usePermissions();
  const t = useTranslations("pagesSettings");
  const tCommon = useTranslations("labels");

  return {
    tableId: "new-arrivals-page-list-table",
    url: `${baseURL}/ecommerce/dashboard/banners?type=new_arrival`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/banners`,
    columns: [
      {
        key: "title",
        label: t("table.image"),
        sortable: false,
      },
      {
        key: "url",
        label: t("table.url"),
        sortable: false,
        render: (_: unknown, row: NewArrivalsRow) => (
          <span className="text-sm truncate max-w-xs block">
            {row.url || "-"}
          </span>
        ),
      },
      {
        key: "is_active",
        label: t("table.status"),
        render: (value: "active" | "inActive", row: NewArrivalsRow) => (
          <TheStatus disabled={!can(PERMISSIONS.ecommerce.banner.activate)} theStatus={value} id={row.id} type="new-arrivals" />
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
