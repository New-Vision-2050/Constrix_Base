import { Switch } from "@/components/ui/switch";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";

export const useWarehousesListTablConfig: () => TableConfig = () => {
  const t = useTranslations();

  return {
    tableId: "warehouses-list-table",
    url: `${baseURL}/ecommerce/warehouses`,
    columns: [
      { key: "name", label: t("labels.name"), sortable: true },
      {
        key: "is_default",
        label: t("labels.default"),
        sortable: true,
        render: (value) => <Switch checked={Boolean(value)} />,
      },
      {
        key: "country",
        label: t("location.country"),
        render: (value) => value?.name,
      },
      {
        key: "city",
        label: t("location.city"),
        render: (value) => value?.name,
      },
      { key: "district", label: t("location.disctrict") },
      { key: "longitude", label: t("location.longitude") },
      { key: "latitude", label: t("location.latitude") },
    ],
  };
};
