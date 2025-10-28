import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "@/modules/bouquet/components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface CouponRow {
  id: string;
  code: string;
  coupon_type: string;
  discount_value: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useCouponTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "coupons-list-table",
    url: `${baseURL}/ecommerce/dashboard/coupons`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/coupons`,
    columns: [
      {
        key: "code",
        label: t("coupon.table.code"),
        sortable: true,
      },
      {
        key: "coupon_type",
        label: t("coupon.table.couponType"),
      },
      {
        key: "discount_amount",
        label: t("coupon.table.discount"),
      },
      {
        key: "max_usage_per_user",
        label: t("coupon.table.userLimit"),
      },
      {
        key: "discount_type",
        label: t("coupon.table.discountType"),
      },

      {
        key: "is_active",
        label: t("coupon.table.status"),
        render: (value: "active" | "inActive", row: CouponRow) => (
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
