"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TableConfig } from "@/modules/table";
import { baseURL } from "@/config/axios-config";

// Order row type interface
export interface OrderRow {
  id: string;
  order_number: string;
  date: string;
  customer_name: string;
  customer_phone: string;
  price: number;
  payment_method: string;
  status: number;
}

export const useHomeStoreTableConfig = (): TableConfig => {
  const t = useTranslations();

  return {
    tableId: "home-store-requests-table",
    url: `${baseURL}/ecommerce/dashboard/orders`,
    
    columns: [
      {
        key: "id",
        label: "معرف الطلب",
        sortable: true,
      },
      {
        key: "order_number",
        label: "رقم الطلب",
        sortable: true,
        render: (_: unknown, row: OrderRow) => (
          <span className="text-white">{row.order_number || "100008"}</span>
        ),
      },
      {
        key: "date",
        label: "تاريخ الطلب",
        sortable: true,
        render: (_: unknown, row: OrderRow) => (
          <div className="text-white">
            <div>12 Oct 2025,</div>
            <div className="text-sm text-gray-400">03:34 PM</div>
          </div>
        ),
      },
      {
        key: "customer",
        label: "معلومات العميل",
        sortable: false,
        render: (_: unknown, row: OrderRow) => (
          <div className="text-white">
            <div>{row.customer_name || "Haydar Qatrawi"}</div>
            <div className="text-sm text-gray-400">
              {row.customer_phone || "+970598873868"}
            </div>
          </div>
        ),
      },
      {
        key: "price",
        label: "السعر",
        sortable: true,
        render: (_: unknown, row: OrderRow) => (
          <span className="text-white">{row.price || "3500"} ريال</span>
        ),
      },
      {
        key: "payment_method",
        label: "السداد الإلكتروني",
        sortable: false,
        render: (_: unknown, row: OrderRow) => (
          <span className="text-white">{row.payment_method || "مصر"}</span>
        ),
      },
      {
        key: "status",
        label: "الحالة",
        sortable: false,
        render: (_: unknown, row: OrderRow) => (
          <Switch
            defaultChecked={row.status === 1}
            className="data-[state=checked]:bg-purple-500"
          />
        ),
      },
      {
        key: "actions",
        label: "إجراءات",
        sortable: false,
        render: (_: unknown, row: OrderRow) => (
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-600/50 text-white border-gray-500 hover:bg-gray-600"
          >
            أدخل
          </Button>
        ),
      },
    ],

    searchParamName: "search",
  };
};
