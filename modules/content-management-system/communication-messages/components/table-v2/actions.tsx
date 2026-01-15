import { MoreHorizontal, Eye, Reply, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommunicationMessage } from "../../types";

interface RowActionsProps {
  row: CommunicationMessage;
  onViewDetails: (id: string) => void;
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
  canView: boolean;
  canReply: boolean;
  canDelete: boolean;
  t: (key: string) => string;
}

/**
 * Row actions dropdown for communication messages
 * Provides View, Reply, and Delete actions with permission checks
 */
export function RowActions({
  row,
  onViewDetails,
  onReply,
  onDelete,
  canView,
  canReply,
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
        {/* View Details */}
        <DropdownMenuItem
          disabled={!canView}
          onClick={() => onViewDetails(row.id)}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("details")}
        </DropdownMenuItem>

        {/* Reply */}
        <DropdownMenuItem
          disabled={row.status === 1 || !canReply}
          onClick={() => onReply(row.id)}
        >
          <Reply className="mr-2 h-4 w-4" />
          {t("reply")}
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
