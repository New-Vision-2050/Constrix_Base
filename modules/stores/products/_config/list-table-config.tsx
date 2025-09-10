import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Product row type interface
export interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock?: number;
  sku: string;
  is_visible: number;
  main_image?: {
    id: number;
    url: string;
    name: string;
    mime_type: string;
    type: string;
  };
}

export interface ProductsListTableConfigProps {
  onEdit?: (id: string) => void;
}

export const useProductsListTableConfig: (
  props?: ProductsListTableConfigProps
) => TableConfig = (props) => {
  const t = useTranslations();
  const { onEdit } = props || {};

  return {
    tableId: "products-list-table",
    url: `${baseURL}/ecommerce/products`,
    deleteUrl: `${baseURL}/ecommerce/products`,

    // Add row actions for edit and delete
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => onEdit?.(row.id)}>
          <Edit className="w-4 h-4" />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],

    executionConfig: {
      canDelete: true,
    },

    columns: [
      {
        key: "main_image",
        label: t("labels.name"),
        sortable: false,
        render: (_: unknown, row: ProductRow) => (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
              {row.main_image?.url ? (
                <Image
                  src={row.main_image.url}
                  alt={row.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-gray-400 text-xs">{t("labels.image")}</div>
              )}
            </div>
            <span className="font-medium">{row.name}</span>
          </div>
        ),
      },
      {
        key: "sku",
        label: t("labels.sku"),
        sortable: true,
        render: (value: string) => (
          <span className="text-gray-600">{value}</span>
        ),
      },
      {
        key: "price",
        label: t("labels.price"),
        sortable: true,
        render: (value: number) => (
          <span className="font-medium">
            {value} {t("labels.currency")}
          </span>
        ),
      },
      {
        key: "stock",
        label: t("labels.stock"),
        sortable: true,
        render: (value: number) => (
          <span className="text-center block">{value || 0}</span>
        ),
      },
      {
        key: "is_visible",
        label: t("labels.status"),
        sortable: true,
        render: (value: number) => (
          <Badge
            className={
              value === 1
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }
            variant="outline"
          >
            {value === 1 ? t("labels.active") : t("labels.inactive")}
          </Badge>
        ),
      },
    ],
  };
};
