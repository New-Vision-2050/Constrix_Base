import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Button } from "@mui/material";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCloseIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: string;
  setSelectedEmployee: (employee: string) => void;
}

export default function EditEmployeeDialog({
  isOpen,
  onClose,
}: EditEmployeeDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [branchDeterminants, setBranchDeterminants] = useState<
    Record<string, string>
  >({
    "فرع جدة": "late-checkin",
    "فرع الرياض": "daily-hours",
    "فرع القصيم": "",
  });

  const DETERMINANT_OPTIONS = [
    { value: "late-checkin", label: "تأخير الحضور" },
    { value: "daily-hours", label: "ساعات الدوام" },
    { value: "early-leave", label: "الانصراف المبكر" },
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const goToNextStep = () => {
    setCurrentStep((previous) => (previous < 3 ? previous + 1 : previous));
  };
  const goToPreviousStep = () => {
    setCurrentStep((previous) => (previous > 1 ? previous - 1 : previous));
  };

  const stepClassName = (step: number) =>
    step <= currentStep
      ? "h-6 w-6 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center"
      : "h-6 w-6 rounded-full bg-muted text-foreground inline-flex items-center justify-center";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle className="text-right text-base">
        تعديل الموظف المحدد
      </DialogTitle>
      <ShieldCloseIcon
        onClick={onClose}
        className="absolute top-4 left-4 cursor-pointer"
      />
      <DialogContent className="max-w-2xl p-6">
        <div className="mt-2 space-y-6">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className={stepClassName(1)}>1</span>
              <span>المحددات الحالية</span>
            </div>
            <div className="w-16 h-px bg-border" />
            <div className="flex items-center gap-2">
              <span className={stepClassName(2)}>2</span>
              <span>تعديل المحددات</span>
            </div>
            <div className="w-16 h-px bg-border" />
            <div className="flex items-center gap-2">
              <span className={stepClassName(3)}>3</span>
              <span>تأكيد وربط المحدد</span>
            </div>
          </div>

          {currentStep === 1 ? (
            <div className="space-y-3">
              {["فرع جدة", "الرياض", "فرع القصيم"].map((branch) => (
                <label
                  key={branch}
                  className="h-12 border border-border rounded-md px-3 flex items-center justify-start cursor-pointer gap-4"
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {}}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm">{branch}</span>
                </label>
              ))}
            </div>
          ) : currentStep === 2 ? (
            <div className="space-y-3">
              {["فرع جدة", "فرع الرياض", "فرع القصيم"].map((branch, index) => {
                const disabled = index === 2;
                return (
                  <div
                    key={branch}
                    className={disabled ? "opacity-50" : ""}
                  >
                    <Select
                      value={branchDeterminants[branch]}
                      onValueChange={(value) =>
                        setBranchDeterminants((previous) => ({
                          ...previous,
                          [branch]: value,
                        }))
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder={branch} />
                      </SelectTrigger>
                      <SelectContent>
                        {DETERMINANT_OPTIONS.map((determinant) => (
                          <SelectItem
                            key={determinant.value}
                            value={determinant.value}
                          >
                            {determinant.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p className="text-right font-medium">قبل</p>
                <p className="text-right font-medium">بعد</p>
              </div>

              {["فرع جدة", "فرع الرياض", "فرع القصيم"].map((branch, index) => {
                const disabled = index === 2;
                return (
                  <div key={branch} className="grid grid-cols-2 gap-4">
                    <label className="h-12 border border-border rounded-md px-3 flex items-center justify-between cursor-pointer">
                      <input
                        type="checkbox"
                        checked
                        onChange={() => {}}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm">{branch}</span>
                    </label>

                    <button
                      type="button"
                      disabled={disabled}
                      className="w-full h-12 border border-border rounded-md px-4 flex items-center justify-between text-sm disabled:opacity-50"
                    >
                      <ChevronDown className="h-4 w-4" />
                      <span>{branch}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex justify-end">
              <Button
                variant="contained"
                className="px-8"
                onClick={goToPreviousStep}
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </Button>
            </div>
            {currentStep < 3 ? (
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  className="px-8"
                  onClick={goToNextStep}
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button variant="contained" className="px-8" onClick={onClose}>
                  حفظ
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
