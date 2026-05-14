import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmployeeId: string;
  onSelectedEmployeeChange: (id: string) => void;
  /** Users that can still be assigned to this determinant */
  employees: Array<{ id: string; name: string }>;
  isAssigning?: boolean;
  onAssign: () => void;
}

export default function AddEmployeeDialog({
  isOpen,
  onOpenChange,
  selectedEmployeeId,
  onSelectedEmployeeChange,
  employees,
  isAssigning = false,
  onAssign,
}: AddEmployeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-right text-base">
          اضافة اسم الموظف
        </DialogTitle>
        <div className="space-y-4" dir="rtl">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-right">
              اسم الموظف
            </p>
            <Select
              value={selectedEmployeeId}
              onValueChange={(value: string) => onSelectedEmployeeChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اسم الموظف" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            className="w-full gap-2"
            disabled={
              !selectedEmployeeId.trim() || isAssigning || employees.length === 0
            }
            onClick={onAssign}
          >
            {isAssigning ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            إضافة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
