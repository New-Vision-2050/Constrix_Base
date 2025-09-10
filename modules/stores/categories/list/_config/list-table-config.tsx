import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon, Settings2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

type Params = {
  onEdit?: (id: string) => void;
  onAddChild?: (id: string) => void;
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
        key: "parent",
        label: t("category.parentCategory"),
        sortable: true,
        render: (value) => value?.name || "-",
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onAddChild?.(row.id)}>
          <Settings2Icon />
          {t("category.addChild")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: true,
    },
  };
};
