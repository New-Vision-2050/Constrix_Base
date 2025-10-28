import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface BranchRow {
  id: string;
  branch_name: string;
  country: string;
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
  const tCommon = useTranslations("labels");

  return {
    tableId: "branch-list-table",
    url: `${baseURL}/ecommerce/dashboard/branches`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/branches`,
    columns: [
      {
        key: "branch_name",
        label: "اسم الفرع",
        sortable: false,
        render: (_: unknown, row: BranchRow) => (
          <span className="text-sm font-medium">
            {row.branch_name || "-"}
          </span>
        ),
      },
      {
        key: "country",
        label: "الدولة",
        sortable: false,
        render: (_: unknown, row: BranchRow) => (
          <span className="text-sm">{row.country || "-"}</span>
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
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          <EditIcon />
          {tCommon("edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: true,
    },
  };
};
