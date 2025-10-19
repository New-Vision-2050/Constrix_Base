import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";

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
      { key: "name", label: t("labels.name"), sortable: true },
      { key: "description", label: t("labels.description"), sortable: true },
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
