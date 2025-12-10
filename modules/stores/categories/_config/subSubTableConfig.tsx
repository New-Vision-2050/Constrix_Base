import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import TheStatus from "../component/the-status";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface CategoryRow {
  id: string;
  name: string;
  description: string;
  parent: { name: string } | null;
  file?: {
    id: number;
    url: string;
    name: string;
    mime_type: string;
    type: string;
  };
  is_active: "active" | "inActive";
}

type Params = {
  onEdit?: (id: string) => void;
  onAddChild?: (id: string) => void;
};

export const useSubSubCategoryTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const { can } = usePermissions();
  const t = useTranslations();

  return {
    tableId: "sub-sub-categories-list-table",
    url: `${baseURL}/ecommerce/dashboard/categories?depth=2`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/categories`,
    columns: [
      {
        key: "name",
        label: "القسم",
        sortable: true,
      },
      {
        key: "priority",
        label: "أولوية",
        render: (value) => value || "-",
      },
      {
        key: "is_active",
        label: "الحالة",
        render: (value: "active" | "inActive", row: CategoryRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem disabled={!can(PERMISSIONS.ecommerce.category.update)} onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.ecommerce.category.delete),
    },
  };
};
