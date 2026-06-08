"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AttendanceConstraints } from "@/services/api/attendance-constraints";
import {
  SectionBorderActions,
} from "../../components/SectionBorderActions";
import { SectionEditPinButton } from "../../components/SectionEditPinButton";
import type { PatchConstraintRulesParams } from "@/services/api/attendance-constraints/types/params";
import type { ConstraintRules } from "@/services/api/attendance-constraints/types/response";
import {
  CONSTRAINT_RULE_OPTIONS,
  type ConstraintRuleField,
} from "./timing-constants";
const RULE_FIELDS: ConstraintRuleField[] = [
  "lateness_minutes",
  "early_clock_in_minutes",
  "max_over_time",
  "out_zone_minutes",
  "max_working_hours",
];

function defaultRuleValues(): Record<ConstraintRuleField, number> {
  return Object.fromEntries(
    CONSTRAINT_RULE_OPTIONS.map((option) => [option.id, option.amount]),
  ) as Record<ConstraintRuleField, number>;
}

function readRuleNumber(source: Record<string, unknown>, key: string): number | undefined {
  const raw = source[key];
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return undefined;
}

function parseConstraintRules(data: unknown): Partial<ConstraintRules> | null {
  if (data == null || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;
  const payload = root.payload;
  const source =
    payload != null && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : root;

  const parsed: Partial<ConstraintRules> = {};
  for (const field of RULE_FIELDS) {
    const value = readRuleNumber(source, field);
    if (value != null) parsed[field] = value;
  }

  return Object.keys(parsed).length > 0 ? parsed : null;
}

function mergeRuleValues(
  fromApi: Partial<ConstraintRules> | null | undefined,
): Record<ConstraintRuleField, number> {
  const defaults = defaultRuleValues();
  if (!fromApi) return defaults;

  return RULE_FIELDS.reduce(
    (acc, field) => {
      acc[field] = fromApi[field] ?? defaults[field];
      return acc;
    },
    { ...defaults },
  );
}

function valuesToPatchBody(
  values: Record<ConstraintRuleField, number>,
): PatchConstraintRulesParams {
  return {
    lateness_minutes: values.lateness_minutes,
    early_clock_in_minutes: values.early_clock_in_minutes,
    max_over_time: values.max_over_time,
    out_zone_minutes: values.out_zone_minutes,
    max_working_hours: values.max_working_hours,
  };
}

export default function AttendanceSettingsSection({
  constraintId,
}: {
  constraintId: string;
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<Record<ConstraintRuleField, number>>(
    defaultRuleValues,
  );

  const rulesQuery = useQuery({
    queryKey: ["constraint-rules", constraintId],
    queryFn: async () => {
      const res = await AttendanceConstraints.getRules(constraintId);
      return parseConstraintRules(res.data);
    },
    enabled: Boolean(constraintId),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (rulesQuery.status !== "success" || isEditing) return;
    setValues(mergeRuleValues(rulesQuery.data));
  }, [rulesQuery.data, rulesQuery.status, isEditing]);

  const patchRulesMutation = useMutation({
    mutationFn: (body: PatchConstraintRulesParams) =>
      AttendanceConstraints.patchRules(constraintId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["constraint-rules", constraintId],
      });
      toast.success("تم حفظ إعدادات تسجيل الحضور والانصراف");
      setIsEditing(false);
    },
    onError: () => {
      toast.error("فشل حفظ إعدادات تسجيل الحضور والانصراف");
    },
  });

  const displayOptions = useMemo(
    () =>
      CONSTRAINT_RULE_OPTIONS.map((option) => ({
        ...option,
        amount: values[option.id] ?? option.amount,
      })),
    [values],
  );

  const handleAmountChange = (id: ConstraintRuleField, raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    setValues((prev) => ({
      ...prev,
      [id]: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
    }));
  };

  const handleCancel = useCallback(() => {
    setValues(mergeRuleValues(rulesQuery.data));
    setIsEditing(false);
  }, [rulesQuery.data]);

  const handleSave = useCallback(() => {
    patchRulesMutation.mutate(valuesToPatchBody(values));
  }, [patchRulesMutation, values]);

  const isBusy = rulesQuery.isLoading || patchRulesMutation.isPending;

  const sectionToolbar = rulesQuery.isLoading
    ? null
    : isEditing
      ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 shrink-0"
              disabled={patchRulesMutation.isPending}
              onClick={handleCancel}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-9 shrink-0 gap-2"
              disabled={patchRulesMutation.isPending}
              onClick={handleSave}
            >
              {patchRulesMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              حفظ
            </Button>
          </>
        )
      : (
          <SectionEditPinButton
            onClick={() => setIsEditing(true)}
            disabled={patchRulesMutation.isPending}
          />
        );

  return (
    <section className="relative rounded-xl border border-primary/90 mt-4 px-5 pb-6 pt-5 shadow-sm backdrop-blur-[2px] sm:px-6 sm:pb-7 sm:pt-6">
      {sectionToolbar != null ? (
        <SectionBorderActions>{sectionToolbar}</SectionBorderActions>
      ) : null}

      <p className="mb-6 text-start text-sm font-semibold leading-snug tracking-tight text-foreground" dir="rtl">
        اعدادات تسجيل الحضور والانصراف
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayOptions.map((option) => (
          <div
            key={option.id}
            className="bg-background border border-border rounded-lg min-h-[92px] px-4 py-3 text-right flex flex-col justify-center"
          >
            {isEditing ? (
              <div className="flex items-center gap-2 justify-start">
                <input
                  type="number"
                  min={0}
                  value={option.amount}
                  disabled={isBusy}
                  onChange={(e) =>
                    handleAmountChange(option.id, e.target.value)
                  }
                  className="h-10 w-16 rounded-md border border-border bg-background px-2 text-lg font-semibold text-primary text-right outline-none focus:border-primary disabled:opacity-50"
                />
                <span className="text-lg font-semibold text-primary">
                  {option.unit}
                </span>
              </div>
            ) : (
              <p className="text-3xl font-semibold text-primary leading-none">
                {rulesQuery.isLoading ? "—" : `${option.amount} ${option.unit}`}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-3">{option.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
