"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { cn } from "@/lib/utils";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Loader2 } from "lucide-react";
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
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.selectedEmployees",
  );
  const isRtl = useIsRtl();

  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsAutocompleteOpen(false);
  }, [isOpen]);

  const selectedEmployee = useMemo(
    () =>
      employees.find((employee) => employee.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId],
  );

  const isExpanded = isAutocompleteOpen;

  return (
    <Dialog
      open={isOpen}
      onClose={() => onOpenChange(false)}
      maxWidth="lg"
      PaperProps={{
        sx: {
          width: { xs: "92%", sm: "50%" },
          maxWidth: 640,
          minHeight: isExpanded ? "min(75vh, 680px)" : 220,
          height: isExpanded ? "min(75vh, 680px)" : "auto",
          transition:
            "min-height 0.35s ease, height 0.35s ease, transform 0.35s ease",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          pt: 2,
          pb: 4,
          minHeight: 0,
        }}
        className="w-full"
      >
        <DialogTitle
          className={cn(
            "shrink-0 text-base px-0 pt-0 pb-2",
            isRtl ? "text-right" : "text-left",
          )}
        >
          {t("addDialogTitle")}
        </DialogTitle>

        <div
          className="flex min-h-0 flex-1 flex-col justify-start gap-4"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="relative z-10 shrink-0">
            <Autocomplete
            key={isOpen ? "open" : "closed"}
            fullWidth
            open={isAutocompleteOpen}
            onOpen={() => setIsAutocompleteOpen(true)}
            onClose={() => setIsAutocompleteOpen(false)}
            options={employees}
            value={selectedEmployee}
            disabled={employees.length === 0 || isAssigning}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={t("noResults")}
            onChange={(_, newValue) =>
              onSelectedEmployeeChange(newValue?.id ?? "")
            }
            slotProps={{
              popper: {
                disablePortal: true,
                placement: "bottom-start",
                sx: {
                  zIndex: (theme) => theme.zIndex.modal + 2,
                  position: "relative !important",
                  transform: "none !important",
                  width: "100%",
                  inset: "auto !important",
                },
              },
              listbox: {
                sx: { maxHeight: "min(40vh, 280px)" },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("employeeNameLabel")}
                placeholder={t("searchPlaceholder")}
              />
            )}
          />
          </div>

          <Button
            type="button"
            className={`w-full shrink-0 gap-2 ${isExpanded ? "mt-auto mb-2" : ""}`}
            disabled={
              !selectedEmployeeId.trim() ||
              isAssigning ||
              employees.length === 0
            }
            onClick={onAssign}
          >
            {isAssigning ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {t("addDialogButton")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
