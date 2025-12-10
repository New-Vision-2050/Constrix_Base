import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface BranchRow {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useBranchTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const { can } = usePermissions();
  const tCommon = useTranslations("labels");

  return {
    tableId: "branch-list-table",
    url: `${baseURL}/ecommerce/dashboard/store-branches?type=contact_us`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/store-branches`,
    columns: [
      {
        key: "name",
        label: "اسم الفرع",
        sortable: false,
        render: (_: unknown, row: BranchRow) => (
          <span className="text-sm font-medium">{row.name || "-"}</span>
        ),
      },

      {
        key: "address",
        label: "العنوان",
        sortable: false,
        render: (_: unknown, row: BranchRow) => (
          <span className="text-sm">{row.address || "-"}</span>
        ),
      },
      {
        key: "phone",
        label: "رقم الهاتف",
        sortable: false,
        render: (_: unknown, row: BranchRow) => (
          <span className="text-sm">{row.phone || "-"}</span>
        ),
      },
      {
        key: "email",
        label: "البريد الالكتروني",
        sortable: false,
        render: (_: unknown, row: BranchRow) => (
          <span className="text-sm">{row.email || "-"}</span>
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
