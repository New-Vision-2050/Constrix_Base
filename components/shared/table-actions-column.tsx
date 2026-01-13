import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface TableActionsColumnProps<T extends { id: string }> {
  row: T;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  can?: (permission: string) => boolean;
  editPermission?: string;
  deletePermission?: string;
  t: (key: string) => string;
  showDelete?: boolean;
}

export function createActionsColumn<T extends { id: string }>({
  editPermission = PERMISSIONS.ecommerce.product.update,
  deletePermission = PERMISSIONS.ecommerce.product.delete,
  showDelete = false,
}: Partial<TableActionsColumnProps<T>> = {}) {
  const ActionsColumn = React.memo(
    ({ row, onEdit, onDelete, can, t }: TableActionsColumnProps<T>) => (
      <>
        <DropdownMenuItem
          disabled={!can?.(editPermission)}
          onSelect={() => onEdit?.(row.id)}
        >
          <Edit className="w-4 h-4" />
          {t("labels.edit")}
        </DropdownMenuItem>
        {showDelete && (
          <DropdownMenuItem
            disabled={!can?.(deletePermission)}
            onSelect={() => onDelete?.(row.id)}
          >
            <Trash2 className="w-4 h-4" />
            {t("labels.delete")}
          </DropdownMenuItem>
        )}
      </>
    )
  );

  ActionsColumn.displayName = "ActionsColumn";
  return ActionsColumn;
}

export const ProductActionsColumn = createActionsColumn({
  editPermission: PERMISSIONS.ecommerce.product.update,
});
