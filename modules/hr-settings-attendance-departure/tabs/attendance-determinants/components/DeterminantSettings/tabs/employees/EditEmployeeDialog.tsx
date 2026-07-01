"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AttendanceConstraintsApi,
  type ConstraintCatalogRow,
  type EmployeeConstraintReplacement,
} from "@/services/api/attendance-constraints";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloseOutlined } from "@mui/icons-material";

type ConstraintSection = "main" | "sub";

/** Shared with invalidateQueries after assign-constraint succeeds. */
const EMPLOYEE_CONSTRAINT_LOCATIONS_QUERY_KEY =
  "attendance-constraints-employee-constraint-locations" as const;

/** Same source as attendance determinants listing: paginated `/attendance/constraints/list`. */
const CONSTRAINTS_FULL_CATALOG_QUERY_KEY =
  "attendance-constraints-full-catalog-grouped" as const;

function mergeCatalogRowsDedup(grouped: {
  main?: ConstraintCatalogRow[];
  additional?: ConstraintCatalogRow[];
}): ConstraintCatalogRow[] {
  const byId = new Map<string, ConstraintCatalogRow>();
  for (const row of [...(grouped.main ?? []), ...(grouped.additional ?? [])]) {
    if (row?.id && row.constraint_name) {
      byId.set(row.id, row);
    }
  }
  return [...byId.values()].sort((a, b) =>
    a.constraint_name.localeCompare(b.constraint_name, "ar"),
  );
}

function rowKey(section: ConstraintSection, constraintId: string) {
  return `${section}:${constraintId}`;
}

function constraintDisplayName(
  pool: { id: string; constraint_name: string }[],
  constraintId: string,
) {
  return pool.find((r) => r.id === constraintId)?.constraint_name ?? constraintId;
}

function constraintIdFromCompositeKey(compositeKey: string): string | null {
  const colon = compositeKey.indexOf(":");
  if (colon <= 0 || colon >= compositeKey.length - 1) return null;
  return compositeKey.slice(colon + 1);
}

function buildConstraintReplacements(
  selectedKeys: string[],
  replacementByKey: Record<string, string>,
): EmployeeConstraintReplacement[] {
  const out: EmployeeConstraintReplacement[] = [];
  for (const key of selectedKeys) {
    const oldId = constraintIdFromCompositeKey(key);
    if (!oldId) continue;
    const chosen = replacementByKey[key]?.trim();
    const newId = chosen || oldId;
    if (newId !== oldId) {
      out.push({
        old_constraint_id: oldId,
        new_constraint_id: newId,
      });
    }
  }
  return out;
}

interface EditEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** Employee user id for GET .../employees/{userId}/constraint-locations */
  userId?: string | null;
  /** Current determinant id — used to refetch the assigned-employees table after save */
  constraintId?: string;
}

export default function EditEmployeeDialog({
  isOpen,
  onClose,
  userId,
  constraintId,
}: EditEmployeeDialogProps) {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.determinantSettings.selectedEmployees",
  );
  const isRtl = useIsRtl();
  const textAlignClass = isRtl ? "text-right" : "text-left";

  const CONSTRAINT_SECTIONS = useMemo(
    () => [
      { id: "main" as ConstraintSection, title: t("sectionMain") },
      { id: "sub" as ConstraintSection, title: t("sectionSub") },
    ],
    [t],
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedKeysList, setSelectedKeysList] = useState<string[]>([]);
  const [replacementByKey, setReplacementByKey] = useState<
    Record<string, string>
  >({});

  const selectedKeysSet = useMemo(
    () => new Set(selectedKeysList),
    [selectedKeysList],
  );

  const employeeUserId = String(userId ?? "").trim();

  const selectionInitializedRef = useRef(false);

  const queryClient = useQueryClient();

  const assignReplacementsMutation = useMutation({
    mutationFn: (
      replacements: EmployeeConstraintReplacement[],
    ): Promise<unknown> =>
      AttendanceConstraintsApi.assignReplacements(employeeUserId, replacements),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [EMPLOYEE_CONSTRAINT_LOCATIONS_QUERY_KEY, employeeUserId],
      });
      const trimmedConstraint = String(constraintId ?? "").trim();
      if (trimmedConstraint) {
        void queryClient.invalidateQueries({
          queryKey: ["constraint-employees", trimmedConstraint],
        });
      }
      toast.success(t("saveSuccess"));
      onClose();
    },
    onError: (error: unknown) => {
      const ax = error as {
        response?: { data?: { message?: unknown } };
      };
      const raw = ax.response?.data?.message;
      const msg =
        typeof raw === "string"
          ? raw
          : raw &&
              typeof raw === "object" &&
              "description" in raw &&
              typeof (raw as { description?: unknown }).description ===
                "string"
            ? String((raw as { description: string }).description)
            : null;
      toast.error(msg ?? t("saveError"));
    },
  });

  const { data: groupedConstraints, isLoading, isError } = useQuery({
    queryKey: [EMPLOYEE_CONSTRAINT_LOCATIONS_QUERY_KEY, employeeUserId],
    queryFn: () =>
      AttendanceConstraintsApi.getEmployeeConstraintLocationsGrouped(
        employeeUserId,
      ),
    enabled: isOpen && Boolean(employeeUserId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: fullCatalogGrouped,
    isLoading: catalogLoading,
    isError: catalogError,
  } = useQuery({
    queryKey: [CONSTRAINTS_FULL_CATALOG_QUERY_KEY],
    queryFn: () => AttendanceConstraintsApi.getCatalogGrouped(),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleSaveAssignments = () => {
    if (!employeeUserId) {
      toast.error(t("noEmployeeLinkedError"));
      return;
    }
    const replacements = buildConstraintReplacements(
      selectedKeysList,
      replacementByKey,
    );
    if (replacements.length === 0) {
      toast.info(t("noChanges"));
      onClose();
      return;
    }
    assignReplacementsMutation.mutate(replacements);
  };

  const optionsBySection = useMemo(() => {
    const apiMain = groupedConstraints?.main ?? [];
    const apiSub = groupedConstraints?.additional ?? [];
    return { main: apiMain, sub: apiSub };
  }, [groupedConstraints]);

  const allCatalogReplacementOptions = useMemo(() => {
    const base = fullCatalogGrouped
      ? mergeCatalogRowsDedup(fullCatalogGrouped)
      : [];
    const byId = new Map<string, ConstraintCatalogRow>(
      base.map((r) => [r.id, r]),
    );
    for (const r of [
      ...(groupedConstraints?.main ?? []),
      ...(groupedConstraints?.additional ?? []),
    ]) {
      if (r?.id && r.constraint_name && !byId.has(r.id)) {
        byId.set(r.id, r);
      }
    }
    return [...byId.values()].sort((a, b) =>
      a.constraint_name.localeCompare(b.constraint_name, "ar"),
    );
  }, [fullCatalogGrouped, groupedConstraints]);

  useEffect(() => {
    selectionInitializedRef.current = false;
  }, [employeeUserId]);

  useEffect(() => {
    if (!isOpen) {
      selectionInitializedRef.current = false;
      return;
    }
    setCurrentStep(1);
    setSelectedKeysList([]);
    setReplacementByKey({});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isLoading || isError || !groupedConstraints) return;
    if (selectionInitializedRef.current) return;
    selectionInitializedRef.current = true;
    const main = groupedConstraints.main ?? [];
    const sub = groupedConstraints.additional ?? [];
    setSelectedKeysList([
      ...main.map((r) => rowKey("main", r.id)),
      ...sub.map((r) => rowKey("sub", r.id)),
    ]);
  }, [isOpen, isLoading, isError, groupedConstraints]);

  useEffect(() => {
    setReplacementByKey((previous) => {
      const next: Record<string, string> = {};
      for (const key of selectedKeysList) {
        next[key] = previous[key] ?? "";
      }
      return next;
    });
  }, [selectedKeysList]);

  const toggleRowSelected = (
    section: ConstraintSection,
    constraintId: string,
  ) => {
    const key = rowKey(section, constraintId);
    setSelectedKeysList((previous) =>
      previous.includes(key)
        ? previous.filter((k) => k !== key)
        : [...previous, key],
    );
  };

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

  const sectionPool = (id: ConstraintSection) =>
    id === "main" ? optionsBySection.main : optionsBySection.sub;

  const statusMessages = (pool: ConstraintCatalogRow[]) => (
    <>
      {isError && employeeUserId && !isLoading && (
        <p className={cn("text-sm text-destructive px-1", textAlignClass)}>
          {t("loadingError")}
        </p>
      )}
      {isLoading && employeeUserId && (
        <p className={cn("text-sm text-muted-foreground px-1", textAlignClass)}>
          {t("loading")}
        </p>
      )}
      {!employeeUserId && (
        <p className={cn("text-xs text-muted-foreground px-1", textAlignClass)}>
          {t("noEmployeeLinked")}
        </p>
      )}
      {!isLoading && !isError && employeeUserId && pool.length === 0 && (
        <p className={cn("text-sm text-muted-foreground px-1", textAlignClass)}>
          {t("noDeterminants")}
        </p>
      )}
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader
          className={cn(
            "gap-3 space-y-0",
            isRtl ? "text-right sm:text-right" : "text-left sm:text-left",
          )}
        >
          <DialogTitle
            className={cn(
              "text-lg font-semibold leading-snug",
              isRtl ? "text-center" : "text-left",
            )}
          >
            {t("dialogTitle")}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-sm text-muted-foreground opacity-80 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 absolute top-4 left-4"
            aria-label={t("close")}
          >
            <CloseOutlined className="h-5 w-5 cursor-pointer" />
          </button>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className={stepClassName(1)}>1</span>
              <span>{t("stepCurrentDeterminants")}</span>
            </div>
            <div className="w-16 h-px bg-border" />
            <div className="flex items-center gap-2">
              <span className={stepClassName(2)}>2</span>
              <span>{t("stepEditDeterminants")}</span>
            </div>
            <div className="w-16 h-px bg-border" />
            <div className="flex items-center gap-2">
              <span className={stepClassName(3)}>3</span>
              <span>{t("stepConfirmLink")}</span>
            </div>
          </div>

          {currentStep === 1 ? (
            <Accordion
              type="multiple"
              defaultValue={["main", "sub"]}
              className="w-full space-y-2"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {CONSTRAINT_SECTIONS.map(({ id, title }) => {
                const pool = sectionPool(id);
                return (
                  <AccordionItem key={id} value={id} className="border-none">
                    <AccordionTrigger
                      className={cn("rounded-lg p-4", textAlignClass)}
                    >
                      {title}
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-2">
                      <div className="space-y-3 max-h-[min(40vh,280px)] overflow-y-auto">
                        {statusMessages(pool)}
                        {pool.map((row: ConstraintCatalogRow) => {
                          const key = rowKey(id, row.id);
                          const checked = selectedKeysSet.has(key);
                          return (
                            <label
                              key={key}
                              className="h-12 border border-border rounded-lg px-3 flex items-center justify-start gap-4 bg-background cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleRowSelected(id, row.id)}
                                className="h-4 w-4 accent-primary shrink-0"
                              />
                              <span className="text-sm">
                                {row.constraint_name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : currentStep === 2 ? (
            <Accordion
              type="multiple"
              defaultValue={["main", "sub"]}
              className="w-full space-y-2"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {CONSTRAINT_SECTIONS.map(({ id, title }) => {
                const pool = sectionPool(id);
                const optionPool = allCatalogReplacementOptions;
                const emptyPool =
                  catalogLoading ||
                  catalogError ||
                  optionPool.length === 0;

                return (
                  <AccordionItem key={id} value={id}>
                    <AccordionTrigger
                      className={cn("py-4 rounded-lg p-4", textAlignClass)}
                    >
                      {title}
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-2">
                      <div className="space-y-3 max-h-[min(40vh,280px)] overflow-y-auto pe-1">
                        {catalogLoading && (
                          <p
                            className={cn(
                              "text-sm text-muted-foreground px-1",
                              textAlignClass,
                            )}
                          >
                            {t("loadingCatalog")}
                          </p>
                        )}
                        {catalogError && !catalogLoading && (
                          <p
                            className={cn(
                              "text-sm text-destructive px-1",
                              textAlignClass,
                            )}
                          >
                            {t("catalogError")}
                          </p>
                        )}
                        {statusMessages(pool)}
                        {pool.length > 0 &&
                          !Array.from(selectedKeysSet).some((k) =>
                            k.startsWith(`${id}:`),
                          ) && (
                            <p
                              className={cn(
                                "text-sm text-muted-foreground px-1",
                                textAlignClass,
                              )}
                            >
                              {t("noSectionSelections")}
                            </p>
                          )}
                        {pool.map((row: ConstraintCatalogRow) => {
                          const rk = rowKey(id, row.id);
                          const isSelectedInStep1 = selectedKeysSet.has(rk);
                          const replacementId = replacementByKey[rk] ?? "";
                          const selectValue = replacementId || row.id;

                          if (!isSelectedInStep1) {
                            return (
                              <div
                                key={rk}
                                className="h-12 border border-border rounded-md px-3 flex items-center justify-start bg-muted/50 text-muted-foreground pointer-events-none select-none"
                              >
                                <span className="text-sm">
                                  {row.constraint_name}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div key={rk}>
                              <Select
                                value={selectValue}
                                onValueChange={(value) =>
                                  setReplacementByKey((previous) => ({
                                    ...previous,
                                    [rk]: value === row.id ? "" : value,
                                  }))
                                }
                                disabled={emptyPool}
                              >
                                <SelectTrigger className="w-full h-12 rounded-md">
                                  <SelectValue
                                    placeholder={row.constraint_name}
                                  />
                                </SelectTrigger>
                                <SelectContent className="max-h-[min(60vh,320px)] overflow-y-auto rounded-md">
                                  {optionPool.map((opt: ConstraintCatalogRow) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                      {opt.constraint_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="space-y-4" dir={isRtl ? "rtl" : "ltr"}>
              {selectedKeysList.length === 0 ? (
                <p
                  className={cn(
                    "text-sm text-muted-foreground px-1",
                    textAlignClass,
                  )}
                >
                  {t("noSelectionsForDisplay")}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm font-medium border-b border-border pb-2">
                    <p className={textAlignClass}>{t("before")}</p>
                    <p className={textAlignClass}>{t("after")}</p>
                  </div>

                  <div className="space-y-2 max-h-[min(50vh,360px)] overflow-y-auto pe-1">
                    {CONSTRAINT_SECTIONS.flatMap(({ id }) => {
                      const pool = sectionPool(id);
                      return pool
                        .filter((row: ConstraintCatalogRow) =>
                          selectedKeysSet.has(rowKey(id, row.id)),
                        )
                        .map((row: ConstraintCatalogRow) => {
                          const rk = rowKey(id, row.id);
                          const replacementId = replacementByKey[rk] ?? "";
                          const afterId = replacementId || row.id;
                          const beforeLabel = row.constraint_name;
                          const catalogName = constraintDisplayName(
                            allCatalogReplacementOptions,
                            afterId,
                          );
                          const afterLabel =
                            catalogName !== afterId
                              ? catalogName
                              : constraintDisplayName(pool, afterId);

                          return (
                            <div
                              key={rk}
                              className="grid grid-cols-2 gap-4 items-center py-2 border-b border-border last:border-b-0"
                            >
                              <p className={cn("text-sm", textAlignClass)}>
                                {beforeLabel}
                              </p>
                              <p className={cn("text-sm", textAlignClass)}>
                                {afterLabel}
                              </p>
                            </div>
                          );
                        });
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex justify-end">
              {currentStep > 1 && (
                <Button
                  variant="contained"
                  className="px-8 gap-1"
                  onClick={goToPreviousStep}
                >
                  {isRtl ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                  {t("previous")}
                </Button>
              )}
            </div>
            {currentStep < 3 ? (
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  className="px-8 gap-1"
                  onClick={goToNextStep}
                >
                  {t("next")}
                  {isRtl ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  className="px-8"
                  disabled={assignReplacementsMutation.isPending}
                  onClick={handleSaveAssignments}
                >
                  {assignReplacementsMutation.isPending
                    ? t("saving")
                    : t("save")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
