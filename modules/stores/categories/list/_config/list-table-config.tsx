import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";

type Params = {
  onEdit?: (id: string) => void;
};

export const useCategoriesListTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();

  return {
    tableId: "categories-list-table",
    url: `${baseURL}/ecommerce/categories`,
    deleteUrl: `${baseURL}/ecommerce/categories`,
    columns: [
      {
        key: "name",
        label: t("labels.name"),
        sortable: true,
      },
      {
        key: "description",
        label: t("labels.description"),
        render: (value) => value || "-",
      },
      {
        key: "createdAt",
        label: t("labels.createdAt"),
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
