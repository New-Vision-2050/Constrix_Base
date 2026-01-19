import React from "react";
import Image from "next/image";
import TheStatus from "./component/the-status";

// Brand row type interface
export interface BrandRow {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  is_active: number;
  num_products: number;
  num_requests: number;
  file?: {
    id: number;
    url: string;
    name: string;
    mime_type: string;
    type: string;
  };
}

export const getBrandsColumns = (t: (key: string) => string) => {
  return [
    {
      key: "name",
      name: t("brand.brandName"),
      sortable: false,
      render: (row: BrandRow) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
            {row.file?.url ? (
              <Image
                src={row.file.url}
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
      key: "num_products",
      name: t("brand.totalProducts"),
      sortable: true,
      render: (row: BrandRow) => <span>{row.num_products}</span>,
    },
    {
      key: "num_requests",
      name: t("brand.totalRequests"),
      sortable: true,
      render: (row: BrandRow) => <span>{row.num_requests}</span>,
    },
    {
      key: "is_active",
      name: t("labels.status"),
      sortable: true,
      render: (row: BrandRow) => (
        <TheStatus
          theStatus={row.is_active === 1 ? "active" : "inActive"}
          id={row.id}
        />
      ),
    },
  ];
};
