import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { OrderStatusChip } from "../components/OrderStatusChip";

interface RequestRow {
  order_serial: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  store: string;
  order_status: {
    order_status: string;
    payment_status: string;
  };
  total_amount: string;
  actions: string;
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useRequestsTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const tCommon = useTranslations("labels");

  return {
    tableId: "requests-list-table",
    url: `${baseURL}/ecommerce/dashboard/orders`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/orders`,
    columns: [
      {
        key: "order_serial",
        label: "معرف الطلب",
        sortable: true,
      },
      {
        key: "order_date",
        label: "تاريخ الطلب",
        sortable: true,
        render: (_: unknown, row: RequestRow) => (
          <span className="text-sm">{row.order_date || "-"}</span>
        ),
      },
      {
        key: "store",
        label: "المتجر",
        sortable: false,
        render: (_: unknown, row: RequestRow) => (
          <span className="text-sm">{row.store || "-"}</span>
        ),
      },

      {
        key: "total_amount",
        label: "الطلبات المكتملة",
        sortable: false,
        render: (_: unknown, row: RequestRow) => (
          <span className="text-sm">{row.total_amount || "-"}</span>
        ),
      },
      {
        key: "order_status",
        label: "الحالة",
        sortable: false,
        render: (_: unknown, row: RequestRow) => (
          <OrderStatusChip status={row.order_status.order_status} />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {tCommon("edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: false,
    },
  };
};
