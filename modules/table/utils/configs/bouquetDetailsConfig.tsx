import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import React from "react";
import GearIcon from "@/public/icons/gear";
import { useRouter } from "next/navigation";
import { ROUTER } from "@/router";
import TheStatus from "@/modules/bouquet/components/the-status";
import { GetBouquetFormConfig } from "@/modules/form-builder/configs/bouquetFormConfig";

// Define types for the bouquet data
interface BouquetData {
  id: string;
  name: string;
  features_count: string;
  price: string;
  subscription_period : string;
  status: string; 
  features: string[];
  duration: string;
  category: string;
}

export interface BouquetTableRow {
  id: string
  name: string
  status: boolean
  features_count: number
  price: string
  currency: string
  subscription_period: number
  subscription_period_unit: string
  company_fields: CompanyField[]
  [key: string]: any; // For any other properties
}
export interface CompanyField {
  id: string
  name: string
}
// Create a component that uses the translations
export const bouquetDetailsConfig = () => {
  const t = useTranslations("Bouquets");
  const router = useRouter();

  return {
    url: `${baseURL}/packages`,
    tableId: "bouquets-table",
    columns: [
      {
        key: "name",
        label: "الصلاحية",
        searchable: true,
        render: (_: unknown, row: BouquetTableRow) => (
            <div>
              <p className="font-medium">{row.name}</p>
            </div>
        ),
      },
      {
        key: "view",
        label: "عرض",
        render: (_: unknown, row: BouquetTableRow) => (
          <TheStatus theStatus={row.status ? "active" : "inActive"} id={row.id} />
        ),
      },
      {
        key: "view",
        label: "تعديل",
        render: (_: unknown, row: BouquetTableRow) => (
          <TheStatus theStatus={row.status ? "active" : "inActive"} id={row.id} />
        ),
      },
      {
        key: "delete",
        label: "حذف",
        render: (_: unknown, row: BouquetTableRow) => (
          <TheStatus theStatus={row.status ? "active" : "inActive"} id={row.id} />
        ),
      },
      {
        key: "delete",
        label: "العدد",
        render: (_: unknown, row: BouquetTableRow) => (
          <TheStatus theStatus={row.status ? "active" : "inActive"} id={row.id} />
        ),
      },
      {
        key: "delete",
        label: "الموظفين",
        render: (_: unknown, row: BouquetTableRow) => (
          <TheStatus theStatus={row.status ? "active" : "inActive"} id={row.id} />
        ),
      },
    ],
    
    defaultSortColumn: "id",
        defaultSortDirection: "asc" as const,
        enableSorting: false,
        enablePagination: false,
        defaultItemsPerPage: 5,
        enableSearch: false,
        enableColumnSearch: false,
        allowSearchFieldSelection: false,
        deleteUrl: `${baseURL}/packages`,
        formConfig: GetBouquetFormConfig(t),
        executionConfig: {
          canEdit: true,
          canDelete: true,
    },
  };
};
