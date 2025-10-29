import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { Edit } from "lucide-react";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import TheStatus from "../components/the-status";

// Payment Method row type interface
export interface PaymentMethodRow {
  id: string;
  name?: string;
  type: string;
  is_active: string;
}

export interface PaymentMethodListTableConfigProps {
  onEdit?: (id: string) => void;
  onToggle?: (id: string, isActive: boolean) => void;
}

export const usePaymentMethodListTableConfig: (
  props?: PaymentMethodListTableConfigProps
) => TableConfig = (props) => {
  const t = useTranslations();
  const locale = useLocale();
  const { onEdit, onToggle } = props || {};

  return {
    tableId: "payment-methods-list-table",
    url: `${baseURL}/ecommerce/dashboard/payment_methods`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/payment_methods`,
    columns: [
      {
        key: "name",
        label: t("paymentMethods.methodName"),
        sortable: true,
      },
      {
        key: "is_active",
        label: t("paymentMethods.status"),
        sortable: false,
        render: (value: "active" | "inActive", row: PaymentMethodRow) => (
          <TheStatus theStatus={value} id={row.type} />
        ),
      },
    ],
    executionConfig: {
      canDelete: true,
    },
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => onEdit?.(row.id)}>
          <Edit className="w-4 h-4" />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    searchParamName: "search",
  };
};
