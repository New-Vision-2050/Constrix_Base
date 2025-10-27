import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "@/modules/bouquet/components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

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

  return {
    tableId: "deal-of-day-list-table",
    url: `${baseURL}/ecommerce/dashboard/deal_days`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/deal_days`,
    columns: [
      {
        key: "name",
        label: "اسم الصفقة",
        sortable: true,
      },
      {
        key: "product.name",
        label: "المنتج",
      },

      {
        key: "is_active",
        label: "نشط",
        render: (value: "active" | "inActive", row: DealOfDayRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: true,
    },
  };
};
