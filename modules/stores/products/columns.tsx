import React from "react";
import Image from "next/image";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import TheStatus from "./add/components/the-status";
import { truncateString } from "@/utils/truncate-string";

// Product row type interface
export interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock?: number;
  sku: string;
  is_visible: number;
  type?: string;
  main_photo?: {
    id: number;
    url: string;
    name: string;
    mime_type: string;
    type: string;
  };
}

export const getProductsColumns = (
  t: (key: string) => string,
  can?: (permission: string) => boolean
) => {
  return [
    {
      key: "main_image",
      name: t("labels.name"),
      sortable: false,
      render: (row: ProductRow) => (
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
          <span className="font-medium">{truncateString(row.name, 30)}</span>
        </div>
      ),
    },
    {
      key: "type",
      name: t("labels.type"),
      sortable: true,
      render: (row: ProductRow) => <span>{row.type || "-"}</span>,
    },
    {
      key: "price",
      name: t("labels.price"),
      sortable: true,
      render: (row: ProductRow) => <span>${row.price.toFixed(2)}</span>,
    },
    {
      key: "stock",
      name: t("labels.stock"),
      sortable: true,
      render: (row: ProductRow) => <span>{row.stock ?? "-"}</span>,
    },
    {
      key: "is_visible",
      name: t("product.fields.status"),
      sortable: true,
      render: (row: ProductRow) => (
        <TheStatus
          disabled={!can?.(PERMISSIONS.ecommerce.product.update)}
          theStatus={row.is_visible === 1 ? "active" : "inActive"}
          id={row.id}
        />
      ),
    },
  ];
};
