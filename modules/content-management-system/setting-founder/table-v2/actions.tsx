import { Edit, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FounderRow } from "../types";

interface RowActionsProps {
  row: FounderRow;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  t: (key: string) => string;
}

/**
 * Row actions dropdown for Founder table
 * Provides Edit and Delete actions with permission checks
 */
export function RowActions({
  row,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  t,
}: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" color="">
          {t("action")}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Edit */}
        <DropdownMenuItem disabled={!canEdit} onClick={() => onEdit(row.id)}>
          <Edit className="mr-2 h-4 w-4" />
          {t("editFounder")}
        </DropdownMenuItem>

        {/* Delete */}
        <DropdownMenuItem
          disabled={!canDelete}
          onClick={() => onDelete(row.id)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
