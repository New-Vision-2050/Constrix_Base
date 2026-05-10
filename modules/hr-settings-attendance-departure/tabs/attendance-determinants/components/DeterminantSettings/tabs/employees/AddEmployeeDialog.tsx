import { EMPLOYEE_ROWS } from "./SelectedEmployees";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@mui/material";

interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: string;
  setSelectedEmployee: (employee: string) => void;
}

export default function AddEmployeeDialog({
  isOpen,
  onClose,
  selectedEmployee,
  setSelectedEmployee,
}: AddEmployeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              value={selectedEmployee}
              onValueChange={(value: string) => setSelectedEmployee(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اسم الموظف" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_ROWS.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="contained" className="w-full" onClick={onClose}>
            إضافة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
