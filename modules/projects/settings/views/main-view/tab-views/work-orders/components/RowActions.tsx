import { Edit, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkOrderType } from "../types";

interface RowActionsProps {
  row: WorkOrderType;
  onShow: (id: string) => void;
  onEdit: (id: string) => void;
  canEdit: boolean;
  canShow: boolean;
  t?: (key: string) => string;
}

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
        {/* show */}
        <DropdownMenuItem disabled={!canShow} onClick={() => onShow(row.id)}>
          <Eye className="mr-2 h-4 w-4" />
          show
        </DropdownMenuItem>
        {/* Edit */}
        <DropdownMenuItem disabled={!canEdit} onClick={() => onEdit(row.id)}>
          <Edit className="mr-2 h-4 w-4" />
          editFounder
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
