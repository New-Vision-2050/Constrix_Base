import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";

type Params = {
  onEdit?: (id: string) => void;
};
export const useProductsListTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "products-list-table",
    url: `${baseURL}/ecommerce/products`,
    deleteUrl: `${baseURL}/ecommerce/products`,
    columns: [
      { key: "id", label: t("labels.id"), type: "text", sortable: true },
      { key: "name", label: t("labels.name"), type: "text", sortable: true },
      {
        key: "sku",
        label: t("product.fields.sku"),
        type: "text",
        sortable: true,
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
