import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface FeaturedDealRow {
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

export const useFeaturedDealTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "featured-deal-list-table",
    url: `${baseURL}/ecommerce/dashboard/feature_deals`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/feature_deals`,
    columns: [
      {
        key: "id",
        label: t("featuredDeal.table.coupon"),
        sortable: true,
      },
      {
        key: "discount_type",
        label: t("featuredDeal.table.couponType"),
      },
      {
        key: "discount_value",
        label: t("featuredDeal.table.amount"),
      },
      {
        key: "usage_limit",
        label: t("featuredDeal.table.userLimit"),
      },
      {
        key: "start_date",
        label: t("featuredDeal.table.monthDate"),
        render: (value: string, row: FeaturedDealRow) => {
          if (!value) return "-";
          const startDate = new Date(value);
          const endDate = new Date(row.end_date);
          return `${startDate.toLocaleDateString(
            "ar-EG"
          )} - ${endDate.toLocaleDateString("ar-EG")}`;
        },
      },
      {
        key: "is_active",
        label: t("featuredDeal.table.status"),
        render: (value: boolean) => (
          <span className={value ? "text-green-500" : "text-red-500"}>
            {value ? t("featuredDeal.table.active") : t("featuredDeal.table.inactive")}
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
