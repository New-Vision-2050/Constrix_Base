"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import TimeSplitInput from "./TimeSplitInput";
import type { DayPeriodRow } from "./timing-types";
import { FIRST_ADD_PERIOD_ROW, shiftPeriodLabel } from "./timing-types";

type AddPeriodsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialRows: DayPeriodRow[];
  onSave: (rows: DayPeriodRow[]) => void;
};

export default function AddPeriodsDialog({
  open,
  onOpenChange,
  title,
  initialRows,
  onSave,
}: AddPeriodsDialogProps) {
  const [rows, setRows] = useState<DayPeriodRow[]>([FIRST_ADD_PERIOD_ROW]);

  useEffect(() => {
    if (!open) return;
    setRows(
      initialRows.length > 0
        ? initialRows.map((r) => ({ ...r }))
        : [{ ...FIRST_ADD_PERIOD_ROW }],
    );
  }, [open, initialRows]);

  const addRow = () => {
    setRows((prev) => {
      const template =
        prev.length > 0
          ? { ...prev[prev.length - 1] }
          : { ...FIRST_ADD_PERIOD_ROW };
      return [...prev, template];
    });
  };

  const updateRow = (index: number, patch: Partial<DayPeriodRow>) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const handleSave = () => {
    if (rows.length === 0) return;
    onSave(rows.map((r) => ({ ...r })));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl max-h-[85vh] overflow-y-auto border-border bg-background p-5 sm:p-6"
        dir="rtl"
        withCrossButton={false}
      >
        <DialogDescription className="sr-only">
          إضافة أو تعديل فترات الدوام والأوقات وخيار اليوم التالي
        </DialogDescription>
        <div className="flex flex-row-reverse items-center justify-between gap-4">
          <DialogTitle className="text-right text-lg font-semibold">
            {title}
          </DialogTitle>
          <Button
            type="button"
            size="sm"
            variant="default"
            className="shrink-0"
            onClick={addRow}
          >
            اضافة
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {rows.map((row, index) => (
            <div
              key={index}
              className="relative rounded-lg border border-border p-3 pt-6"
            >
              <span className="absolute right-3 top-2 text-xs text-muted-foreground">
                {shiftPeriodLabel(index)}{" "}
                <span className="text-primary">*</span>
              </span>
              <div className="flex flex-wrap items-end gap-3 md:gap-4">
                <div className="min-w-[140px] flex-1">
                  <TimeSplitInput
                    label="من"
                    timeValue={row.from}
                    meridiem={row.fromMeridiem}
                    placeholder="02:00"
                    onTimeChange={(value) => updateRow(index, { from: value })}
                    onMeridiemChange={(value) =>
                      updateRow(index, { fromMeridiem: value })
                    }
                  />
                </div>
                <div className="flex min-w-[220px] flex-1 flex-wrap items-end gap-2 md:gap-3">
                  <div className="min-w-[140px] flex-1">
                    <TimeSplitInput
                      label="الى"
                      timeValue={row.to}
                      meridiem={row.toMeridiem}
                      placeholder="09:00"
                      onTimeChange={(value) => updateRow(index, { to: value })}
                      onMeridiemChange={(value) =>
                        updateRow(index, { toMeridiem: value })
                      }
                    />
                  </div>
                  <label className="inline-flex shrink-0 items-center gap-2 pb-1 text-sm select-none">
                    <Checkbox
                      checked={row.endsNextDay}
                      onCheckedChange={(checked) =>
                        updateRow(index, {
                          endsNextDay: checked === true,
                        })
                      }
                      className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span>اليوم التالي</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="default"
          className="mt-6 h-11 w-full"
          onClick={handleSave}
        >
          حفظ
        </Button>
      </DialogContent>
    </Dialog>
  );
}
