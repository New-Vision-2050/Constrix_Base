import { useMemo } from "react";
import { EMPLOYEE_ROWS } from "./SelectedEmployees";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Autocomplete, Button, TextField } from "@mui/material";

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
  const selectedOption = useMemo(
    () => EMPLOYEE_ROWS.find((e) => e.id === selectedEmployee) ?? null,
    [selectedEmployee],
  );

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
            <Autocomplete
              fullWidth
              options={EMPLOYEE_ROWS}
              value={selectedOption}
              onChange={(_, option) => setSelectedEmployee(option?.id ?? "")}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              ListboxProps={{
                sx: { maxHeight: 280, direction: "rtl" },
              }}
              slotProps={{
                popper: {
                  sx: { zIndex: (theme) => theme.zIndex.modal + 2 },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="اسم الموظف"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": { direction: "rtl" },
                  }}
                  inputProps={{
                    ...params.inputProps,
                    dir: "rtl",
                  }}
                />
              )}
              noOptionsText="لا توجد نتائج"
            />
          </div>

          <Button variant="contained" className="w-full" onClick={onClose}>
            إضافة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
