import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import TheStatus from "../add/components/the-status";

// Product row type interface
export interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock?: number;
  sku: string;
  is_visible: number;
  main_photo?: {
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
    url: `${baseURL}/ecommerce/dashboard/products`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/products`,

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
              {row.main_photo?.url ? (
                <Image
                  src={row.main_photo.url}
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
        key: "type",
        label: t("labels.type"),
        sortable: true,
      },
      {
        key: "price",
        label: t("labels.price"),
        sortable: true,
      },
      {
        key: "stock",
        label: t("labels.stock"),
        sortable: true,
      },
      {
        key: "is_visible",
        label: t("product.fields.status"),
        render: (value: "active" | "inActive", row: ProductRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
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
