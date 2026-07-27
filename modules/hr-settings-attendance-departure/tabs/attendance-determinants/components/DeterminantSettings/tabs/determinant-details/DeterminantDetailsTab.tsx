"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  SectionBorderActions,
} from "../../components/SectionBorderActions";
import { SectionEditPinButton } from "../../components/SectionEditPinButton";

type ConstraintTypeOption = { code: string; name: string };

function mapConstraintTypeRow(row: unknown): ConstraintTypeOption | null {
  if (!row || typeof row !== "object") return null;
  const rec = row as Record<string, unknown>;
  const code = String(rec.code ?? rec.slug ?? rec.key ?? rec.id ?? "").trim();
  const name = String(
    rec.name ?? rec.label_ar ?? rec.title ?? rec.code ?? "",
  ).trim();
  if (!code) return null;
  return { code, name: name || code };
}

/** API returns a single constraint type in `payload` (array of one or one object). */
function parseConstraintTypeOption(payload: unknown): ConstraintTypeOption | null {
  if (payload == null) return null;
  if (Array.isArray(payload)) {
    for (const row of payload) {
      const mapped = mapConstraintTypeRow(row);
      if (mapped) return mapped;
    }
    return null;
  }
  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const direct = mapConstraintTypeRow(obj);
    if (direct) return direct;
    const nested = obj.objects ?? obj.data ?? obj.items;
    if (nested != null) return parseConstraintTypeOption(nested);
  }
  return null;
}

async function fetchConstraintTypeOption(): Promise<ConstraintTypeOption | null> {
  const res = await apiClient.get<{ payload?: unknown }>(
    "attendance/constraints/types",
    { params: { page: 1, per_page: 10 } },
  );
  const body = res.data as Record<string, unknown>;
  return parseConstraintTypeOption(body.payload ?? body.data ?? body);
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
  if (basic?.branch_ids?.length) {
    return basic.branch_ids.map((id) => String(id).trim()).filter(Boolean);
  }
  const fromBranches =
    c.branches?.map((b) => String(b.id ?? "").trim()).filter(Boolean) ?? [];
  if (fromBranches.length) return fromBranches;
  const fromLocs =
    c.branch_locations?.map((b) => String(b.id ?? "").trim()).filter(Boolean) ??
    [];
  if (fromLocs.length) return fromLocs;
  const fromBasicBranches =
    basic?.branches?.map((b) => String(b.id ?? "").trim()).filter(Boolean) ?? [];
  if (fromBasicBranches.length) return fromBasicBranches;
  return (
    basic?.branch_locations
      ?.map((b) => String(b.id ?? "").trim())
      .filter(Boolean) ?? []
  );
}

function branchNamesFromConstraint(
  c: Constraint,
  basic: ConstraintBasicInfo | undefined,
): string[] {
  const names = [
    ...(c.branches?.map((b) => b.name) ?? []),
    ...(c.branch_locations?.map((b) => b.name) ?? []),
    ...(basic?.branches?.map((b) => b.name) ?? []),
    ...(basic?.branch_locations?.map((b) => b.name) ?? []),
  ]
    .map((n) => n?.trim())
    .filter(Boolean) as string[];
  return [...new Set(names)];
}

function resolveEditorBranchIds(
  c: Constraint,
  basic: ConstraintBasicInfo | undefined,
  lookup: { id: string; name: string }[] | undefined,
): string[] {
  const fromIds = branchIdsFromConstraint(c, basic);
  if (!lookup?.length) return fromIds;

  const lookupById = new Set(lookup.map((b) => b.id));
  const matchedById = fromIds.filter((id) => lookupById.has(id));
  if (matchedById.length) return matchedById;

  const names = branchNamesFromConstraint(c, basic);
  if (!names.length) return fromIds;

  const normalizedNames = new Set(names.map((n) => n.toLowerCase()));
  return lookup
    .filter((b) => normalizedNames.has(b.name.toLowerCase()))
    .map((b) => b.id);
}

function branchDraftIncludes(draft: string[], branchId: string): boolean {
  const id = String(branchId);
  return draft.some((entry) => String(entry) === id);
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
    <section className="relative rounded-xl border border-primary/90 px-5 pb-6 pt-5 shadow-sm backdrop-blur-[2px] sm:px-6 sm:pb-7 sm:pt-6">
      {actions != null ? (
        <SectionBorderActions>{actions}</SectionBorderActions>
      ) : null}
      <div className="mb-6" dir="rtl">
        <h2 className="text-start text-sm font-semibold leading-snug tracking-tight text-foreground">
          {title}
        </h2>
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
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.determinantDetails",
  );
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

  const constraintTypeQuery = useQuery({
    queryKey: ["attendance-constraint-type"],
    queryFn: fetchConstraintTypeOption,
    staleTime: 5 * 60_000,
  });

  const constraintTypeOption = constraintTypeQuery.data ?? null;

  const branchesLookupQuery = useQuery({
    queryKey: ["management-hierarchies-branches", "determinant-details"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=branch`,
      ),
    staleTime: 5 * 60_000,
  });

  const resolvedBranchIds = useMemo(
    () =>
      resolveEditorBranchIds(
        mergedConstraint,
        basicInfo,
        branchesLookupQuery.data,
      ),
    [mergedConstraint, basicInfo, branchesLookupQuery.data],
  );

  const resolvedTypeCode = useMemo(() => {
    if (constraintTypeOption?.code) return constraintTypeOption.code;
    return (
      mergedConstraint.constraint_type?.trim() ||
      mergedConstraint.constraint_code?.trim() ||
      ""
    );
  }, [
    constraintTypeOption,
    mergedConstraint.constraint_code,
    mergedConstraint.constraint_type,
  ]);

  const typeDisplayName = useMemo(() => {
    if (constraintTypeOption) return constraintTypeOption.name;
    return resolvedTypeCode || "—";
  }, [constraintTypeOption, resolvedTypeCode]);

  const viewTypeSelectValue = resolvedTypeCode || "__none";

  const queryClient = useQueryClient();

  const [editingBasics, setEditingBasics] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [typeDraft, setTypeDraft] = useState("");
  const [branchIdsDraft, setBranchIdsDraft] = useState<string[]>([]);
  const showSkeletonRows = isLoading && !basicInfo;

  useEffect(() => {
    if (editingBasics) return;
    setTypeDraft(resolvedTypeCode);
    setBranchIdsDraft(resolvedBranchIds);
  }, [editingBasics, resolvedTypeCode, resolvedBranchIds]);

  useEffect(() => {
    if (!editingBasics || !constraintTypeOption?.code) return;
    setTypeDraft(constraintTypeOption.code);
  }, [editingBasics, constraintTypeOption]);

  useEffect(() => {
    if (!editingBasics || resolvedBranchIds.length === 0) return;
    setBranchIdsDraft((prev) => (prev.length > 0 ? prev : resolvedBranchIds));
  }, [editingBasics, resolvedBranchIds]);

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
    },
  });

  const beginEditBasics = useCallback(() => {
    setNameDraft(displayName !== "—" ? displayName : "");
    setTypeDraft(resolvedTypeCode);
    setBranchIdsDraft(resolvedBranchIds);
    setEditingBasics(true);
  }, [
    displayName,
    resolvedTypeCode,
    resolvedBranchIds,
  ]);

  const saveBasics = useCallback(() => {
    const trimmed = nameDraft.trim();
    const typeTrim = typeDraft.trim();
    patchBasicInfoMutation.mutate({
      constraint_name: trimmed || undefined,
      ...(trimmed ? { name: trimmed } : {}),
      constraint_type: typeTrim || undefined,
      ...(branchIdsDraft.length > 0 ? { branch_ids: [...branchIdsDraft] } : {}),
    });
  }, [nameDraft, typeDraft, branchIdsDraft, patchBasicInfoMutation]);

  const isSavingBasicInfo = patchBasicInfoMutation.isPending;

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
          {t("cancel")}
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
          {t("save")}
        </Button>
      </>
    ) : (
        <SectionEditPinButton
          onClick={beginEditBasics}
          disabled={isSavingBasicInfo}
        />
    );

  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <DetailsSection title={t("sectionBasics")} actions={basicsToolbar}>
        <div

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
                  {t("determinantName")}
                </label>
                <TextField
                  hiddenLabel
                  fullWidth
                  label={t("determinantName")}
                  variant="outlined"
                  disabled={showSkeletonRows || !editingBasics}
                  value={
                    isError ? "—" : editingBasics ? nameDraft : displayName
                  }
                  onChange={(e) => setNameDraft(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      minHeight: 48,
                      alignItems: "center",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "left",
                    },
                  }}
                />
              </div>
              <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2">
                <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
                  {t("determinantSystem")}
                </label>
                {editingBasics ? (
                  constraintTypeQuery.isPending ? (
                    <Skeleton className="h-12 w-full rounded-md" />
                  ) : (
                    <Select
                      value={typeDraft || constraintTypeOption?.code || ""}
                      onValueChange={setTypeDraft}
                      disabled={Boolean(constraintTypeOption)}
                    >
                      <SelectTrigger

                        className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
                      >
                        <SelectValue placeholder={t("selectSystem")} />
                      </SelectTrigger>
                      <SelectContent >
                        {constraintTypeOption ? (
                          <SelectItem value={constraintTypeOption.code}>
                            {constraintTypeOption.name}
                          </SelectItem>
                        ) : typeDraft ? (
                          <SelectItem value={typeDraft}>{typeDraft}</SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
                  )
                ) : (
                  <Select value={viewTypeSelectValue} disabled>
                    <SelectTrigger

                      className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
                    >
                      <SelectValue placeholder={typeDisplayName} />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value={viewTypeSelectValue}>
                        {typeDisplayName}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="flex min-h-0 min-w-0 w-full flex-col items-stretch gap-2 md:col-span-2">
                <label className="block text-start text-xs font-medium leading-none text-muted-foreground">
                  {t("branch")}
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
                              checked={branchDraftIncludes(
                                branchIdsDraft,
                                branch.id,
                              )}
                              onCheckedChange={(c) =>
                                setBranchIdsDraft((prev) =>
                                  c === true
                                    ? branchDraftIncludes(prev, branch.id)
                                      ? prev
                                      : [...prev, branch.id]
                                    : prev.filter(
                                        (id) => String(id) !== String(branch.id),
                                      ),
                                )
                              }
                            />
                            <span className="flex-1 text-right">
                              {branch.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <Select value={branchText} disabled>
                    <SelectTrigger

                      className="h-12 w-full min-w-0 rounded-md border-border bg-background/80"
                    >
                      <SelectValue placeholder={branchText} />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value={branchText}>{branchText}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </>
          )}
        </div>
      </DetailsSection>
    </div>
  );
}
