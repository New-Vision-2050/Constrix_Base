"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ConstraintCatalogRow } from "@/modules/hr-settings-attendance-departure/api/getConstraintsCatalogGrouped";
import { getEmployeeConstraintLocationsGrouped } from "@/modules/hr-settings-attendance-departure/api/getEmployeeConstraintLocations";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@mui/material";
import { ChevronLeft, ChevronRight, ShieldCloseIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ConstraintSection = "main" | "sub";

const CONSTRAINT_SECTIONS: { id: ConstraintSection; title: string }[] = [
  { id: "main", title: "المحددات الرئيسية" },
  { id: "sub", title: "المحددات الفرعية" },
];

/** Shown until API returns rows for that section (or when loading / no user / error). */
const DUMMY_CONSTRAINT_LOCATIONS: {
  main: ConstraintCatalogRow[];
  sub: ConstraintCatalogRow[];
} = {
  main: [
    { id: "dummy-main-1", constraint_name: "فرع جدة" },
    { id: "dummy-main-2", constraint_name: "الرياض" },
  ],
  sub: [{ id: "dummy-sub-1", constraint_name: "فرع القصيم" }],
};

function rowKey(section: ConstraintSection, constraintId: string) {
  return `${section}:${constraintId}`;
}

interface EditEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** Employee user id for GET .../employees/{userId}/constraint-locations */
  userId: string;
}

export default function EditEmployeeDialog({
  isOpen,
  onClose,
  userId,
}: EditEmployeeDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedKeysList, setSelectedKeysList] = useState<string[]>([]);
  const [replacementByKey, setReplacementByKey] = useState<
    Record<string, string>
  >({});

  const selectedKeysSet = useMemo(
    () => new Set(selectedKeysList),
    [selectedKeysList],
  );

  const employeeUserId = userId.trim();

  const { data: groupedConstraints, isLoading, isError } = useQuery({
    queryKey: [
      "attendance-constraints-employee-constraint-locations",
      employeeUserId,
    ],
    queryFn: () => getEmployeeConstraintLocationsGrouped(employeeUserId),
    enabled: isOpen && Boolean(employeeUserId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { optionsBySection, usingFallbackData } = useMemo(() => {
    const loadingOrNoUser = !employeeUserId || isLoading;
    const apiMain = groupedConstraints?.main ?? [];
    const apiSub = groupedConstraints?.additional ?? [];

    if (loadingOrNoUser || isError) {
      return {
        usingFallbackData: true,
        optionsBySection: {
          main: DUMMY_CONSTRAINT_LOCATIONS.main,
          sub: DUMMY_CONSTRAINT_LOCATIONS.sub,
        },
      };
    }

    const main = apiMain.length > 0 ? apiMain : DUMMY_CONSTRAINT_LOCATIONS.main;
    const sub = apiSub.length > 0 ? apiSub : DUMMY_CONSTRAINT_LOCATIONS.sub;
    const usingFallbackData =
      apiMain.length === 0 || apiSub.length === 0;

    return { usingFallbackData, optionsBySection: { main, sub } };
  }, [employeeUserId, isLoading, isError, groupedConstraints]);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep(1);
    setSelectedKeysList([]);
    setReplacementByKey({});
  }, [isOpen]);

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

  const statusMessages = (pool: { id: string }[]) => (
    <>
      {usingFallbackData &&
        employeeUserId &&
        !isLoading &&
        !isError &&
        (groupedConstraints?.main?.length === 0 ||
          groupedConstraints?.additional?.length === 0) && (
          <p className="text-xs text-muted-foreground text-right px-1">
            عرض بيانات تجريبية للقسم الذي لا يملك بيانات بعد.
          </p>
        )}
      {isError && employeeUserId && !isLoading && (
        <p className="text-sm text-destructive text-right px-1">
          تعذر تحميل المحددات؛ يتم عرض قائمة تجريبية.
        </p>
      )}
      {isLoading && employeeUserId && (
        <p className="text-sm text-muted-foreground text-right px-1">
          جاري التحميل… (قائمة تجريبية مؤقتة)
        </p>
      )}
      {!employeeUserId && (
        <p className="text-xs text-muted-foreground text-right px-1">
          لم يتم ربط موظف؛ عرض محددات تجريبية.
        </p>
      )}
      {!isLoading && !isError && pool.length === 0 && (
        <p className="text-sm text-muted-foreground text-right px-1">
          لا توجد محددات
        </p>
      )}
    </>
  );

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
            <Accordion
              type="multiple"
              defaultValue={["main", "sub"]}
              className="w-full space-y-2"
              dir="rtl"
            >
              {CONSTRAINT_SECTIONS.map(({ id, title }) => {
                const pool = sectionPool(id);
                return (
                  <AccordionItem key={id} value={id} className="border-none">
                    <AccordionTrigger className="py-4 text-right rounded-lg">
                      {title}
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-2">
                      <div className="space-y-3 max-h-[min(40vh,280px)] overflow-y-auto pe-1">
                        {statusMessages(pool)}
                        {pool.map((row) => {
                          const key = rowKey(id, row.id);
                          const checked = selectedKeysSet.has(key);
                          return (
                            <label
                              key={key}
                              className="h-12 border border-border rounded-md px-3 flex items-center justify-start gap-4 bg-background cursor-pointer"
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
              dir="rtl"
            >
              {CONSTRAINT_SECTIONS.map(({ id, title }) => {
                const pool = sectionPool(id);
                const optionPool = pool;
                const emptyPool = optionPool.length === 0;
                const selectedRows = pool.filter((row) =>
                  selectedKeysSet.has(rowKey(id, row.id)),
                );

                return (
                  <AccordionItem key={id} value={id} className="border-none">
                    <AccordionTrigger className="py-4 text-right rounded-lg">
                      {title}
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-2">
                      <div className="space-y-3 max-h-[min(40vh,280px)] overflow-y-auto pe-1">
                        {statusMessages(pool)}
                        {pool.length > 0 && selectedRows.length === 0 && (
                          <p className="text-sm text-muted-foreground text-right px-1">
                            لم يتم اختيار محددات من هذا القسم في الخطوة الأولى
                          </p>
                        )}
                        {selectedRows.map((row) => {
                          const rk = rowKey(id, row.id);
                          const replacementId = replacementByKey[rk] ?? "";
                          const selectValue = replacementId || row.id;
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
                                <SelectTrigger className="w-full h-12">
                                  <SelectValue
                                    placeholder={row.constraint_name}
                                  />
                                </SelectTrigger>
                                <SelectContent className="max-h-[min(60vh,320px)] overflow-y-auto">
                                  {optionPool.map((opt) => (
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
            <div className="space-y-3" dir="rtl">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                <p className="text-right">قبل</p>
                <p className="text-right">بعد</p>
              </div>

              <Accordion
                type="multiple"
                defaultValue={["main", "sub"]}
                className="w-full space-y-2"
              >
                {CONSTRAINT_SECTIONS.map(({ id, title }) => {
                  const pool = sectionPool(id);
                  const optionPool = pool;
                  const emptyPool = optionPool.length === 0;
                  const selectedRows = pool.filter((row) =>
                    selectedKeysSet.has(rowKey(id, row.id)),
                  );

                  return (
                    <AccordionItem key={id} value={id} className="border-none">
                      <AccordionTrigger className="py-4 text-right rounded-lg">
                        {title}
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pb-2">
                        <div className="space-y-3 max-h-[min(40vh,280px)] overflow-y-auto pe-1">
                          {statusMessages(pool)}
                          {pool.length > 0 && selectedRows.length === 0 && (
                            <p className="text-sm text-muted-foreground text-right px-1">
                              لم يتم اختيار محددات من هذا القسم في الخطوة الأولى
                            </p>
                          )}
                          {selectedRows.map((row) => {
                            const rk = rowKey(id, row.id);
                            const replacementId = replacementByKey[rk] ?? "";
                            const selectValue = replacementId || row.id;

                            return (
                              <div
                                key={rk}
                                className="grid grid-cols-2 gap-4 items-stretch"
                              >
                                <label className="min-h-12 border border-border rounded-md px-3 flex items-center justify-between gap-3 bg-background cursor-default">
                                  <span className="text-sm text-right flex-1">
                                    {row.constraint_name}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked
                                    readOnly
                                    tabIndex={-1}
                                    aria-hidden
                                    className="h-4 w-4 accent-primary shrink-0 pointer-events-none"
                                  />
                                </label>

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
                                  <SelectTrigger className="w-full min-h-12 h-auto py-2">
                                    <SelectValue
                                      placeholder={row.constraint_name}
                                    />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[min(60vh,320px)] overflow-y-auto">
                                    {optionPool.map((opt) => (
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
