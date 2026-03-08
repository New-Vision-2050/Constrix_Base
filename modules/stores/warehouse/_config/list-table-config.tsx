import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
type Params = {
  onEdit?: (id: string) => void;
};
export const useWarehousesListTablConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations();
  const { can } = usePermissions();
  return {
    tableId: "warehouses-list-table",
    url: `${baseURL}/ecommerce/warehouses`,
    deleteUrl: `${baseURL}/ecommerce/warehouses`,
    columns: [
      { key: "name", label: t("labels.name"), sortable: true },
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
      {
        key: "is_default",
        label: t("labels.default"),
        render: (value) => <Switch checked={Boolean(value)} />,
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem disabled={!can(PERMISSIONS.ecommerce.warehouse.update)} onSelect={() => params?.onEdit?.(row.id)}>
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.ecommerce.warehouse.delete),
    },
    searchParamName: "search",
  };
};
