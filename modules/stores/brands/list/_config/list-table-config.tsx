import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";

export const useBrandsListTableConfig: () => TableConfig = () => {
  const t = useTranslations();

  return {
    tableId: "brands-list-table",
    url: `${baseURL}/ecommerce/brands`,
    columns: [
      { key: "name", label: t("labels.name"), sortable: true },
      { key: "description", label: t("labels.description"), sortable: true },
    ],
  };
};
