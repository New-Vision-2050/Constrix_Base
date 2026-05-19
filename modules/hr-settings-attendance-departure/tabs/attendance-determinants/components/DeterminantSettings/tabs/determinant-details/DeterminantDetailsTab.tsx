"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Loader2, Pencil, Settings } from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Constraint } from "@/modules/hr-settings-attendance-departure/types/constraint-type";
import { TextField } from "@mui/material";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendanceConstraints } from "@/services/api/attendance-constraints";
import type { PatchConstraintBasicInfoParams } from "@/services/api/attendance-constraints/types/params";
import type { ConstraintBasicInfo } from "@/services/api/attendance-constraints/types/response";
import {
  constraintBasicInfoQueryKey,
  useConstraintBasicInfo,
} from "../../../../hooks/useConstraintBasicInfo";
import { apiClient, baseURL } from "@/config/axios-config";
import { fetchManagementHierarchyOptions } from "@/utils/fetchDropdownOptions";

type ConstraintTypeOption = { code: string; name: string };

const WEEK_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/** Half-hour grid 00:00 … 23:30 */
const HALF_HOUR_TIMES: string[] = (() => {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30] as const) {
      out.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }
  }
  return out;
})();

function sortTimeStrings(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return ah * 60 + am - (bh * 60 + bm);
}

function normalizeClock(raw: string): string {
  const t = raw?.trim() ?? "";
  if (!t) return "09:00";
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return "09:00";
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
  const min = Math.min(59, Math.max(0, parseInt(m[2], 10)));
  const rounded = min >= 30 ? 30 : 0;
  return `${String(h).padStart(2, "0")}:${rounded === 0 ? "00" : "30"}`;
}

function mergeConstraintFromBasicInfo(
  constraint: Constraint,
  basic: ConstraintBasicInfo | undefined,
): Constraint {
  if (!basic) return constraint;
  return {
    ...constraint,
    ...(basic.name !== undefined ? { name: basic.name } : {}),
    ...(basic.constraint_name !== undefined
      ? { constraint_name: basic.constraint_name }
      : {}),
    ...(basic.constraint_type !== undefined
      ? { constraint_type: basic.constraint_type }
      : {}),
    ...(basic.branches !== undefined ? { branches: basic.branches } : {}),
    ...(basic.branch_locations !== undefined
      ? { branch_locations: basic.branch_locations }
      : {}),
    ...(basic.config !== undefined ? { config: basic.config } : {}),
  };
}

function referenceClockFromBasicInfo(
  basic: ConstraintBasicInfo | undefined,
  fallbackConstraint: Constraint,
): string {
  if (!basic) return firstPeriodStart(fallbackConstraint);
  const tz = basic.timezone?.trim() ?? "";
  if (/^\d{1,2}:\d{2}/.test(tz)) return normalizeClock(tz);
  const ref =
    basic.reference_time ??
    basic.daily_start_time ??
    basic.daily_reference_time;
  if (typeof ref === "string" && ref.trim()) return normalizeClock(ref);
  return firstPeriodStart(mergeConstraintFromBasicInfo(fallbackConstraint, basic));
}

function countryFieldsFromBasicInfo(
  basic: ConstraintBasicInfo | undefined,
): { selectValue: string; labelText: string } {
  const code = basic?.country_code?.trim().toLowerCase();
  const labelForSa = "المملكة العربية السعودية";
  if (code === "sa") return { selectValue: "sa", labelText: labelForSa };
  if (basic?.country?.trim())
    return { selectValue: code ?? "country", labelText: basic.country.trim() };
  if (code) return { selectValue: code, labelText: code };
  return { selectValue: "sa", labelText: labelForSa };
}

function firstPeriodStart(constraint: Constraint): string {
  const ws = constraint.config?.time_rules?.weekly_schedule;
  if (!ws) return "09:00";
  for (const day of WEEK_DAYS) {
    const d = ws[day];
    if (d?.enabled && d.periods?.length) {
      const p0 = d.periods[0] as { start_time?: string; from?: string };
      const raw = p0?.start_time ?? p0?.from;
      if (raw) return normalizeClock(String(raw));
    }
  }
  return "09:00";
}

function branchDisplayText(constraint: Constraint): string {
  const fromBranches =
    constraint.branches?.map((b) => b.name).filter(Boolean) ?? [];
  if (fromBranches.length) return fromBranches.join("، ");
  const fromLocs =
    constraint.branch_locations?.map((b) => b.name).filter(Boolean) ?? [];
  if (fromLocs.length) return fromLocs.join("، ");
  return "—";
}

function branchIdsFromConstraint(
  c: Constraint,
  basic: ConstraintBasicInfo | undefined,
): string[] {
  if (basic?.branch_ids?.length)
    return basic.branch_ids.map((id) => String(id).trim()).filter(Boolean);
  const fromBranches =
    (c.branches?.map((b) => b.id).filter(Boolean) as string[]) ?? [];
  if (fromBranches.length) return fromBranches;
  const fromLocs =
    (c.branch_locations?.map((b) => b.id).filter(Boolean) as string[]) ?? [];
  return fromLocs;
}

function timeOptionsWithDefault(fallback: string): string[] {
  const set = new Set(HALF_HOUR_TIMES);
  if (!set.has(fallback)) {
    return [...HALF_HOUR_TIMES, fallback].sort(sortTimeStrings);
  }
  return [...HALF_HOUR_TIMES];
}

function DetailsSection({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-primary/90 px-5 pb-6 pt-5 shadow-sm backdrop-blur-[2px] sm:px-6 sm:pb-7 sm:pt-6">
      <div className="mb-6 flex items-center justify-between gap-3 sm:gap-4">
        <h2 className="min-w-0 flex-1 text-sm font-semibold leading-snug tracking-tight text-foreground">
          {title}
        </h2>
        <div className="flex shrink-0 flex-row-reverse flex-wrap items-center gap-1">
          {actions ?? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10"
                aria-label="تعديل"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10"
                aria-label="الإعدادات"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function DeterminantDetailsTab({
  constraint,
}: {
  constraint: Constraint;
}) {
  const {
    data: basicInfo,
    isLoading,
    isError,
  } = useConstraintBasicInfo(constraint.id);

  const mergedConstraint = useMemo(
    () => mergeConstraintFromBasicInfo(constraint, basicInfo),
    [constraint, basicInfo],
  );

  const displayName = useMemo(() => {
    const n =
      mergedConstraint.name?.trim() ||
      mergedConstraint.constraint_name?.trim() ||
      "";
    return n || "—";
  }, [mergedConstraint.constraint_name, mergedConstraint.name]);

  const branchText = useMemo(
    () => branchDisplayText(mergedConstraint),
    [mergedConstraint],
  );

  const constraintTypesQuery = useQuery({
    queryKey: ["attendance-constraint-types"],
    queryFn: async (): Promise<ConstraintTypeOption[]> => {
      const res = await apiClient.get<{
        payload?: unknown;
      }>("attendance/constraints/types", {
        params: { page: 1, per_page: 200 },
      });
      const body = res.data as Record<string, unknown>;
      const raw = body.payload ?? body.data ?? body;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { objects?: unknown })?.objects)
          ? (raw as { objects: unknown[] }).objects
          : [];
      return (list as Record<string, unknown>[])
        .map((row) => ({
          code: String(row.code ?? row.slug ?? row.key ?? row.id ?? ""),
          name: String(
            row.name ?? row.label_ar ?? row.title ?? row.code ?? "",
          ).trim(),
        }))
        .filter((o) => o.code.length > 0);
    },
    staleTime: 5 * 60_000,
  });

  const branchesLookupQuery = useQuery({
    queryKey: ["management-hierarchies-branches", "determinant-details"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=branch`,
      ),
    staleTime: 5 * 60_000,
  });

  const resolvedBranchIds = useMemo(
    () => branchIdsFromConstraint(mergedConstraint, basicInfo),
    [mergedConstraint, basicInfo],
  );

  const typeDisplayName = useMemo(() => {
    const code =
      mergedConstraint.constraint_type?.trim() ||
      mergedConstraint.constraint_code?.trim() ||
      "";
    if (!code || code === "—") return "—";
    const match = constraintTypesQuery.data?.find((o) => o.code === code);
    return match?.name ?? code;
  }, [
    mergedConstraint.constraint_code,
    mergedConstraint.constraint_type,
    constraintTypesQuery.data,
  ]);

  const viewTypeSelectValue =
    mergedConstraint.constraint_type?.trim() ||
    mergedConstraint.constraint_code?.trim() ||
    "__none";

  const defaultPeriodStart = useMemo(
    () => referenceClockFromBasicInfo(basicInfo, constraint),
    [basicInfo, constraint],
  );

  const { selectValue: countrySelectValue, labelText: countryLabelText } =
    useMemo(
      () => countryFieldsFromBasicInfo(basicInfo),
      [basicInfo],
    );

  const timeChoices = useMemo(
    () => timeOptionsWithDefault(defaultPeriodStart),
    [defaultPeriodStart],
  );

  const showSkeletonRows = isLoading && !basicInfo;

  const queryClient = useQueryClient();

  const [editingBasics, setEditingBasics] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [typeDraft, setTypeDraft] = useState("");
  const [branchIdsDraft, setBranchIdsDraft] = useState<string[]>([]);
  const [editingCountry, setEditingCountry] = useState(false);
  const [countryCodeDraft, setCountryCodeDraft] = useState("");
  const [timeDraft, setTimeDraft] = useState("");

  useEffect(() => {
    if (editingCountry) return;
    setCountryCodeDraft(countrySelectValue);
    setTimeDraft(defaultPeriodStart);
  }, [countrySelectValue, defaultPeriodStart, editingCountry]);

  useEffect(() => {
    if (editingBasics) return;
    setTypeDraft(
      mergedConstraint.constraint_type?.trim() ||
        mergedConstraint.constraint_code?.trim() ||
        "",
    );
    setBranchIdsDraft(resolvedBranchIds);
  }, [
    editingBasics,
    mergedConstraint.constraint_code,
    mergedConstraint.constraint_type,
    resolvedBranchIds,
  ]);

  const branchChoicesForEditor = useMemo(() => {
    const base = [...(branchesLookupQuery.data ?? [])];
    const ids = new Set(base.map((b) => b.id));
    for (const id of branchIdsDraft) {
      if (!ids.has(id)) {
        base.push({ id, name: id });
        ids.add(id);
      }
    }
    return base;
  }, [branchesLookupQuery.data, branchIdsDraft]);

  const patchBasicInfoMutation = useMutation({
    mutationFn: (params: PatchConstraintBasicInfoParams) =>
      AttendanceConstraints.patchBasicInfo(constraint.id, params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: constraintBasicInfoQueryKey(constraint.id),
      });
      setEditingBasics(false);
      setEditingCountry(false);
    },
  });

  const beginEditBasics = useCallback(() => {
    setEditingCountry(false);
    setNameDraft(displayName !== "—" ? displayName : "");
    setTypeDraft(
      mergedConstraint.constraint_type?.trim() ||
        mergedConstraint.constraint_code?.trim() ||
        "",
    );
    setBranchIdsDraft(resolvedBranchIds);
    setEditingBasics(true);
  }, [
    displayName,
    mergedConstraint.constraint_code,
    mergedConstraint.constraint_type,
    resolvedBranchIds,
  ]);

  const beginEditCountry = useCallback(() => {
    setEditingBasics(false);
    setCountryCodeDraft(countrySelectValue);
    setTimeDraft(defaultPeriodStart);
    setEditingCountry(true);
  }, [countrySelectValue, defaultPeriodStart]);

  const saveBasics = useCallback(() => {
    const trimmed = nameDraft.trim();
    const typeTrim = typeDraft.trim();
    patchBasicInfoMutation.mutate({
      constraint_name: trimmed || undefined,
      ...(trimmed ? { name: trimmed } : {}),
      constraint_type: typeTrim || undefined,
      ...(branchIdsDraft.length > 0
        ? { branch_ids: [...branchIdsDraft] }
        : {}),
    });
  }, [nameDraft, typeDraft, branchIdsDraft, patchBasicInfoMutation]);

  const saveCountry = useCallback(() => {
    patchBasicInfoMutation.mutate({
      country_code: countryCodeDraft || undefined,
      timezone: timeDraft,
      reference_time: timeDraft,
    });
  }, [countryCodeDraft, patchBasicInfoMutation, timeDraft]);

  const isSavingBasicInfo = patchBasicInfoMutation.isPending;

  const countryResolvedValue = editingCountry
    ? countryCodeDraft
    : countrySelectValue;

  const basicsToolbar =
    showSkeletonRows || isError ? undefined : editingBasics ? (
      <>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0"
          disabled={isSavingBasicInfo}
          onClick={() => setEditingBasics(false)}
        >
          إلغاء
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-9 shrink-0 gap-2"
          disabled={
            isSavingBasicInfo ||
            !nameDraft.trim() ||
            !typeDraft.trim() ||
            branchIdsDraft.length === 0
          }
          onClick={saveBasics}
        >
          {isSavingBasicInfo ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          حفظ
        </Button>
      </>
    ) : (
      <>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10"
          aria-label="تعديل"
          onClick={beginEditBasics}
          disabled={isSavingBasicInfo}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10"
          aria-label="الإعدادات"
          disabled={isSavingBasicInfo}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </>
    );

  const countryToolbar =
    showSkeletonRows || isError ? undefined : editingCountry ? (
      <>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0"
          disabled={isSavingBasicInfo}
          onClick={() => setEditingCountry(false)}
        >
          إلغاء
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-9 shrink-0 gap-2"
          disabled={isSavingBasicInfo}
          onClick={saveCountry}
        >
          {isSavingBasicInfo ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          حفظ
        </Button>
      </>
    ) : (
      <>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10"
          aria-label="تعديل"
          onClick={beginEditCountry}
          disabled={isSavingBasicInfo}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10"
          aria-label="الإعدادات"
          disabled={isSavingBasicInfo}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </>
    );

  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <DetailsSection title="بيانات المحدد" actions={basicsToolbar}>
        <div
          dir="rtl"
          className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 md:items-start"
        >
          {showSkeletonRows ? (
            <>
              <Skeleton className="h-[76px] w-full" />
              <Skeleton className="h-[76px] w-full" />
              <Skeleton className="h-[76px] w-full md:col-span-2" />
            </>
          ) : (
            <>
              <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2">
                <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
                  اسم المحدد
                </label>
                <TextField
                  hiddenLabel
                  fullWidth
                  label="اسم المحدد"
                  variant="outlined"
                  disabled={showSkeletonRows || !editingBasics}
                  value={isError ? "—" : editingBasics ? nameDraft : displayName}
                  onChange={(e) => setNameDraft(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      minHeight: 48,
                      alignItems: "center",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "right",
                    },
                  }}
                />
              </div>
              <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2">
                <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
                  نظام المحدد
                </label>
                {editingBasics ? (
                  <Select value={typeDraft} onValueChange={setTypeDraft}>
                    <SelectTrigger
                      dir="rtl"
                      className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
                    >
                      <SelectValue placeholder="اختر النظام" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {(constraintTypesQuery.data ?? []).map((opt) => (
                        <SelectItem key={opt.code} value={opt.code}>
                          {opt.name}
                        </SelectItem>
                      ))}
                      {typeDraft &&
                      !(constraintTypesQuery.data ?? []).some(
                        (o) => o.code === typeDraft,
                      ) ? (
                        <SelectItem value={typeDraft}>{typeDraft}</SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select value={viewTypeSelectValue} disabled>
                    <SelectTrigger
                      dir="rtl"
                      className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
                    >
                      <SelectValue placeholder={typeDisplayName} />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value={viewTypeSelectValue}>
                        {typeDisplayName}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 md:col-span-2">
                <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
                  الفرع
                </label>
                {editingBasics ? (
                  branchesLookupQuery.isPending ? (
                    <Skeleton className="h-[120px] w-full rounded-md" />
                  ) : (
                    <div className="max-h-52 min-h-[3rem] w-full overflow-y-auto rounded-lg border border-border bg-background/40 p-3">
                      <div className="flex flex-col gap-2">
                        {branchChoicesForEditor.map((branch) => (
                          <label
                            key={branch.id}
                            className="flex cursor-pointer select-none flex-row-reverse items-center gap-2 rounded-md px-1 py-1 text-sm hover:bg-muted/50"
                          >
                            <Checkbox
                              className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              checked={branchIdsDraft.includes(branch.id)}
                              onCheckedChange={(c) =>
                                setBranchIdsDraft((prev) =>
                                  c === true
                                    ? prev.includes(branch.id)
                                      ? prev
                                      : [...prev, branch.id]
                                    : prev.filter((id) => id !== branch.id),
                                )
                              }
                            />
                            <span className="flex-1 text-right">{branch.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <Select value={branchText} disabled>
                    <SelectTrigger
                      dir="rtl"
                      className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
                    >
                      <SelectValue placeholder={branchText} />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value={branchText}>{branchText}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </>
          )}
        </div>
      </DetailsSection>

      <DetailsSection title="محدد الدول" actions={countryToolbar}>
        <div
          dir="rtl"
          className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:items-start"
        >
          {showSkeletonRows ? (
            <>
              <Skeleton className="h-[76px] w-full" />
              <Skeleton className="h-[76px] w-full" />
            </>
          ) : (
            <>
              <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 sm:col-span-1">
                <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
                  اسم الدولة
                </label>
                <Select
                  value={countryResolvedValue}
                  disabled={showSkeletonRows || !editingCountry}
                  onValueChange={(v) => {
                    if (editingCountry) setCountryCodeDraft(v);
                  }}
                >
                  <SelectTrigger
                    dir="rtl"
                    className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
                  >
                    <SelectValue placeholder={countryLabelText} />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="sa">المملكة العربية السعودية</SelectItem>
                    {countryResolvedValue !== "sa" &&
                    countryResolvedValue ? (
                      <SelectItem value={countryResolvedValue}>
                        {countryLabelText}
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 sm:col-span-1">
                <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
                  التوقيت الزمني
                </label>
                <Select
                  value={editingCountry ? timeDraft : defaultPeriodStart}
                  disabled={showSkeletonRows || !editingCountry}
                  onValueChange={(v) => {
                    if (editingCountry) setTimeDraft(v);
                  }}
                >
                  <SelectTrigger
                    dir="rtl"
                    className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
                  >
                    <SelectValue
                      placeholder={
                        editingCountry ? timeDraft : defaultPeriodStart
                      }
                    />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {timeChoices.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </DetailsSection>
    </div>
  );
}
