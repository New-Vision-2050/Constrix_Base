import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import React from "react";
import GearIcon from "@/public/icons/gear";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";
import { useRouter } from "next/navigation";
import { ROUTER } from "@/router";

// Define types for the bouquet data
interface BouquetData {
  id: string;
  name: string;
  price: string;
  status: string;
  features: string[];
  duration: string;
  category: string;
}

export interface BouquetTableRow {
  id: string;
  name: string;
  price: string;
  status: "active" | "inActive";
  features_count: number;
  duration: string;
  category: string;
  created_at: string;
  [key: string]: any; // For any other properties
}

// Create a component that uses the translations
export const bouquetConfig = () => {
  const t = useTranslations("Bouquets");
  const router = useRouter();

  return {
    url: `${baseURL}/bouquets`,
    tableId: "bouquets-table",
    columns: [
      {
        key: "name",
        label: "اسم الباقة",
        searchable: true,
        render: (_: unknown, row: BouquetTableRow) => (
          <div 
            className="flex gap-3 border-e-2 cursor-pointer"
            onClick={() => router.push(ROUTER.BouquetById(row.id))}
          >
            <div>
              <p className="font-medium">{row.name}</p>
            </div>
          </div>
        ),
      },
      {
        key: "price",
        label: "عدد الخدمات",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">{row.price}</p>
        ),
      },
      {
        key: "features_count",
        label: "عدد قيمة الاشتراك",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">{row.features_count}</p>
        ),
      },
      {
        key: "duration",
        label: "مدة الاشتراك ",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">{row.duration}</p>
        ),
      },
      {
        key: "category",
        label: "مجالات الباقة",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">{row.category}</p>
        ),
      },
      {
        key: "status",
        label: "الحالة",
        render: (_: unknown, row: BouquetTableRow) => (
          <TheStatus theStatus={row.status} id={row.id} />
        ),
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (_: unknown, row: BouquetTableRow) => (
          <div className="flex items-center gap-2">
            <button 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => console.log("Edit bouquet:", row)}
            >
              <GearIcon className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    actions: [
      {
        key: "edit",
        label: "تعديل",
        onClick: (row: BouquetTableRow) => {
          console.log("Edit bouquet:", row);
        },
      },
      {
        key: "delete",
        label: "حذف",
        onClick: (row: BouquetTableRow) => {
          console.log("Delete bouquet:", row);
        },
      },
    ],
  };
};
