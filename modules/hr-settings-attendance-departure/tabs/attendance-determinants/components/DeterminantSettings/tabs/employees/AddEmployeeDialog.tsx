import { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle className="text-right text-base">
          اضافة اسم الموظف
        </DialogTitle>
        <div className="space-y-4" dir="rtl">
          <Autocomplete
            key={isOpen ? "open" : "closed"}
            fullWidth
            options={employees}
            value={selectedEmployee}
            disabled={employees.length === 0 || isAssigning}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText="لا توجد نتائج"
            onChange={(_, newValue) =>
              onSelectedEmployeeChange(newValue?.id ?? "")
            }
            slotProps={{
              popper: {
                disablePortal: true,
                sx: { zIndex: (theme) => theme.zIndex.modal + 2 },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="اسم الموظف"
                placeholder="بحث باسم الموظف"
              />
            )}
          />

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
