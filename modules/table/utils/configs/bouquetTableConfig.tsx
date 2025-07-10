import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import React from "react";
import GearIcon from "@/public/icons/gear";
import { useParams, useRouter } from "next/navigation";
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
export const 

bouquetConfig = () => {
  const t = useTranslations("Bouquets");
  const router = useRouter();
  const params = useParams();
  const id = params?.id 
  return {
    url: `${baseURL}/packages?company_access_program_id=${id}`,
    tableId: "bouquets-table",
    columns: [
      {
        key: "name",
        label: "اسم الباقة",
        searchable: true,
        render: (_: unknown, row: BouquetTableRow) => (
          <div 
            className="flex gap-3 border-e-2 cursor-pointer"
            onClick={() => router.push(`/bouquetDetails/${row.id}`)}
          >
            <div>
              <p className="font-medium">{row.name}</p>
            </div>
          </div>
        ),
      },
      {
        key: "features_count",
        label: "عدد الخدمات",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">{row.features_count}</p>
        ),
      },
      {
        key: "price",
        label: "قيمة الاشتراك",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">{row.price}</p>
        ),
      },
      {
        key: "subscription_period",
        label: "مدة الاشتراك ",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">{row.subscription_period}</p>
        ),
      },
      {
        key: "company_fields",
        label: "مجالات الباقة",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">{row.company_fields.map((field) => field.name).join(", ")}</p>
        ),
      },
      {
        key: "status",
        label: "الحالة",
        render: (_: unknown, row: BouquetTableRow) => (
          <TheStatus theStatus={row.status ? "active" : "inActive"} id={row.id} />
        ),
      },
     
    ],
     allSearchedFields: [
          {
            key: "name",
            searchType: {
              type: "text",
              placeholder: "اسم الباقة",
            },
          },
          {
            key: "company_field_id",
            searchType: {
              type: "dropdown",
              placeholder: "المجال",
              dynamicDropdown: {
                url: `${baseURL}/company_fields`,
                valueField: "id",
                isMulti: true,
                labelField: "name",
                paginationEnabled: true,
                itemsPerPage: 20,
                searchParam: "name",
                pageParam: "page",
                limitParam: "per_page",
                totalCountHeader: "x-total-count",
              },
            },
          },
           {
            key: "status",
            searchType: {
              type: "dropdown",
              placeholder: "الحالة",
              dropdownOptions: [
                { value: "1", label: "نشط" },
                { value: "0", label: "غير نشط" },
              ],
            },
          },
       
        ],
    defaultSortColumn: "id",
        defaultSortDirection: "asc" as const,
        enableSorting: true,
        enablePagination: true,
        defaultItemsPerPage: 5,
        enableSearch: true,
        enableColumnSearch: true,
        searchFields: ["name", "email"],
        searchParamName: "q",
        searchFieldParamName: "fields",
        allowSearchFieldSelection: true,
        formConfig: GetBouquetFormConfig(t, undefined),
        executions:[],
        executionConfig: {
          canEdit: true,
          canDelete: true,
    },
  };
};
