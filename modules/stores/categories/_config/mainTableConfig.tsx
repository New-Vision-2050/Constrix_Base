import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon, Settings2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import TheStatus from "../component/the-status";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface CategoryRow {
  id: string;
  name: string;
  priority: string;
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

export const useMainCategoryTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const { can } = usePermissions();
  const t = useTranslations();

  return {
    tableId: "categories-list-table",
    url: `${baseURL}/ecommerce/dashboard/categories?depth=0`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/categories`,
    columns: [
      {
        key: "name",
        label: "القسم",
        sortable: true,
        render: (_: unknown, row: CategoryRow) => (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
              {row.file?.url ? (
                <Image
                  src={row.file.url}
                  alt={row.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-gray-400 text-xs">{t("labels.image")}</div>
              )}
            </div>
            <span className="font-medium">{row.name}</span>
          </div>
        ),
      },
      {
        key: "priority",
        label: "أولوية",
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
