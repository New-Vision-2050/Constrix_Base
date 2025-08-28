import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";

export const useWarehousesListTablConfig: () => TableConfig = () => {
  const t = useTranslations("location");

  return {
    tableId: "warehouses-list-table",
    url: `${baseURL}/ecommerce/warehouses`,
  };
};
