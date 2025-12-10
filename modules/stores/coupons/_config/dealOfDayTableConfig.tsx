import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "@/modules/bouquet/components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface DealOfDayRow {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  product_id: string;
  product: {
    name: string;
  };
  discount_type: "percentage" | "amount";
  discount_value: number;
  is_active: "active" | "inActive";
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useDealOfDayTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();
  const { can } = usePermissions();
  return {
    tableId: "deal-of-day-list-table",
    url: `${baseURL}/ecommerce/dashboard/deal_days`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/deal_days`,
    columns: [
      {
        key: "name",
        label: t("dealOfDay.table.dealName"),
        sortable: true,
      },
      {
        key: "product.name",
        label: t("dealOfDay.table.product"),
      },

      {
        key: "is_active",
        label: t("dealOfDay.table.active"),
        render: (value: "active" | "inActive", row: DealOfDayRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem disabled={!can(PERMISSIONS.ecommerce.dealDay.update)} onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.ecommerce.dealDay.delete),
    },
  };
};
