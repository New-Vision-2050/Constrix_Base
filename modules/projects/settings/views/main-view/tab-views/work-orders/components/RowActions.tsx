import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RowActionsProps } from "../types";
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';

export function RowActions({
  row,
  onShow,
  onEdit,
  canEdit,
  canShow,
}: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="bg-slate-400 hover:bg-slate-400">
          action
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={!canShow}
          onClick={() => onShow(row.id, "display")}
        >
          <VisibilityIcon className="mr-2 h-4 w-4" color="primary" />
          show
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={!canEdit}
          onClick={() => onEdit(row.id, "edit")}
        >
          <BorderColorIcon className="mr-2 h-4 w-4" color="primary"/>
          editFounder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
