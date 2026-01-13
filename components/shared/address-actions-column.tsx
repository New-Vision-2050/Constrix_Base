import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { MenuItem } from "@mui/material";
import { Button } from "@mui/material";
import { CustomMenu } from "@/components/ui/custom-menu";

interface AddressActionsColumnProps<T extends { id: string }> {
  row: T;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  t: (key: string) => string;
  showDelete?: boolean;
}

export function AddressActionsColumn<T extends { id: string }>({
  showDelete = true,
}: Partial<AddressActionsColumnProps<T>> = {}) {
  return React.memo(
    ({ row, onEdit, onDelete, t }: AddressActionsColumnProps<T>) => (
      <CustomMenu
        renderAnchor={({ onClick }) => (
          <Button onClick={onClick}>{t("table.actions")}</Button>
        )}
      >
        <MenuItem onClick={() => onEdit?.(row.id)}>
          <Edit className="w-4 h-4 ml-2" />
          {t("table.edit")}
        </MenuItem>
        {showDelete && (
          <MenuItem onClick={() => onDelete?.(row.id)}>
            <Trash2 className="w-4 h-4 ml-2" />
            {t("table.delete")}
          </MenuItem>
        )}
      </CustomMenu>
    )
  );
}

AddressActionsColumn.displayName = "AddressActionsColumn";
