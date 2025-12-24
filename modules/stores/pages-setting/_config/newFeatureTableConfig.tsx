import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import TheStatus from "../components/the-status";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface NewFeatureRow {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useNewFeatureTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const { can } = usePermissions();
  const tCommon = useTranslations("labels");

  return {
    tableId: "new-feature-list-table",
    url: `${baseURL}/ecommerce/dashboard/features?type=contact_us`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/features`,
    columns: [
      {
        key: "title",
        label: "العنوان",
        sortable: false,
        render: (_: unknown, row: NewFeatureRow) => (
          <span className="text-sm font-medium">{row.title || "-"}</span>
        ),
      },
      {
        key: "description",
        label: "وصف",
        sortable: false,
        render: (_: unknown, row: NewFeatureRow) => (
          <span className="text-sm">{row.description || "-"}</span>
        ),
      },
      {
        key: "is_active",
        label: "النشر",
        render: (value: "active" | "inActive", row: NewFeatureRow) => (
          <TheStatus disabled={!can(PERMISSIONS.ecommerce.banner.activate)} theStatus={value} id={row.id} type="new-features" />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem disabled={!can(PERMISSIONS.ecommerce.banner.update)} onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {tCommon("edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.ecommerce.banner.delete),
    },
  };
};
