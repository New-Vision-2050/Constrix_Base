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
        label: "قسيمة",
        sortable: true,
      },
      {
        key: "coupon_type",
        label: "نوع القسيمة",
      },
      {
        key: "discount_amount",
        label: "الخصم",
      },
      {
        key: "max_usage_per_user",
        label: "حد المستخدم",
      },
      {
        key: "discount_type",
        label: "نوع الخصم",
      },

      {
        key: "is_active",
        label: "الحالة",
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
