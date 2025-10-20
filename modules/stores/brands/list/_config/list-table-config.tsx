import TableStatusSwitcher from "@/components/shared/table-status";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { apiClient, baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import Image from "next/image";

export interface BrandRow {
  id: string;
  name: string;
  status: number;
  num_products: number;
  num_requests: number;
  main_image?: {
    id: number;
    url: string;
    name: string;
    mime_type: string;
    type: string;
  };
}
type Params = {
  onEdit?: (id: string) => void;
};
export const useBrandsListTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "brands-list-table",
    url: `${baseURL}/ecommerce/dashboard/brands`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/brands`,
    columns: [
      {
        key: "name",
        label: "اسم العلامة التجارية",
        sortable: true,
        render: (_: unknown, row: BrandRow) => (
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
      { key: "num_products", label: "مجموع المنتجات", sortable: true },
      { key: "num_requests", label: "مجموع الطلبات", sortable: true },
      {
        key: "status",
        label: "الحالة",
        sortable: true,
        render: (_: unknown, row: BrandRow) => (
          <TableStatusSwitcher
            id={row.id}
            label={"نشط"}
            initialStatus={row.status == 1}
            confirmAction={async (isActive) => {
              return await apiClient.patch(`/write-url/${row.id}/status`, {
                status: Number(isActive),
              });
            }}
            confirmDescription={(isActive) =>
              !isActive ? "تغير الحالة الى غير نشط" : "تغير الحالة الى نشط"
            }
            showDatePicker={() => false}
          />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: true,
    },
  };
};
