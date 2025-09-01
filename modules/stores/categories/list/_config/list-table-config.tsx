import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";

export const useCategoriesListTableConfig: () => TableConfig = () => {
  const t = useTranslations();

  return {
    tableId: "categories-list-table",
    url: `${baseURL}/ecommerce/categories`,
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
    executions: [],
  };
};
