import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface DealOfDayRow {
  id: string;
  product_name: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
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
    url: `${baseURL}/ecommerce/dashboard/deal-of-day`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/deal-of-day`,
    columns: [
      {
        key: "id",
        label: "قسيمة",
        sortable: true,
      },
      {
        key: "discount_type",
        label: "نوع القسيمة",
      },
      {
        key: "discount_value",
        label: "المبلغ",
      },
      {
        key: "usage_limit",
        label: "حد المستخدم",
      },
      {
        key: "start_date",
        label: "تاريخ الشهر",
        render: (value: string, row: DealOfDayRow) => {
          if (!value) return "-";
          const startDate = new Date(value);
          const endDate = new Date(row.end_date);
          return `${startDate.toLocaleDateString("ar-EG")} - ${endDate.toLocaleDateString("ar-EG")}`;
        },
      },
      {
        key: "is_active",
        label: "الحالة",
        render: (value: boolean) => (
          <span className={value ? "text-green-500" : "text-red-500"}>
            {value ? "نشط" : "غير نشط"}
          </span>
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
