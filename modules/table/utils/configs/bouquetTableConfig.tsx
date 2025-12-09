import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import React from "react";
import GearIcon from "@/public/icons/gear";
import { useParams, useRouter } from "next/navigation";
import { ROUTER } from "@/router";
import TheStatus from "@/modules/bouquet/components/the-status";
import { GetBouquetFormConfig } from "@/modules/form-builder/configs/bouquetFormConfig";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

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
export const bouquetConfig = () => {
  const t = useTranslations("Bouquets");
  const router = useRouter();
  const params = useParams();
  const id = params?.id 
  const {can} = usePermissions();
  
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
            className={can(PERMISSIONS.package.view) ? "flex gap-3 border-e-2 cursor-pointer" : "flex gap-3 border-e-2"}
            onClick={() => can(PERMISSIONS.package.view) && router.push(`/bouquetDetails/${row.id}`)}
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
        render: (_: unknown, row: BouquetTableRow) => {
          return <p className="font-medium">{row.subscription_period} {t(`${row.subscription_period_unit}`)}</p>
        },
      },
      {
        key: "company_fields",
        label: "مجالات الباقة",
        render: (_: unknown, row: BouquetTableRow) => (
          <p className="font-medium">
            {row.company_fields.length > 3
              ? row.company_fields.slice(0, 3).map((field) => field.name).join(", ") + "..."
              : row.company_fields.map((field) => field.name).join(", ")}
          </p>
        ),
      },
      {
        key: "status",
        label: "الحالة",
        render: (value: "active" | "inActive", row: BouquetTableRow) => (
          <TheStatus theStatus={value} id={row.id} />
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
        enableExport: can(PERMISSIONS.package.export),
        searchFields: ["name", "company_field_id", "status"],
        searchParamName: "name",
        searchFieldParamName: "fields",
        allowSearchFieldSelection: true,
        formConfig: GetBouquetFormConfig(t, undefined),
        executions:[],
        executionConfig: {
          canEdit: can(PERMISSIONS.package.update),
          canDelete: can(PERMISSIONS.package.delete),
    },
  };
};
