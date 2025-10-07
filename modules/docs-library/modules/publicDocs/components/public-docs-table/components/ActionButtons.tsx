import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Action buttons component
 * Provides document action menu with various operations
 */
interface ActionButtonsProps {
  documentId: string;
}

export const ActionButtons = ({ documentId }: ActionButtonsProps) => {
  const handleAction = (action: string) => {
    console.log(`${action} action for document:`, documentId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleAction('view')}>
          عرض
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('download')}>
          تحميل
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('share')}>
          مشاركة
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('edit')}>
          تعديل
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAction('delete')}
          className="text-destructive"
        >
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
