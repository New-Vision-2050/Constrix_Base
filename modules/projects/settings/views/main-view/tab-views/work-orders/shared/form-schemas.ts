import * as z from "zod";

export type TranslateForm = (key: string) => string;

export function createWorkOrderFormSchema(t: TranslateForm) {
  return z.object({
    code: z.string().trim().min(1, t("consultantCodeRequired")),
    description: z.string().trim().min(1, t("workOrderDescriptionRequired")),
    type: z.string().trim().min(1, t("workOrderTypeRequired")),
  });
}

export type WorkOrderFormValues = z.infer<
  ReturnType<typeof createWorkOrderFormSchema>
>;

export function createSectionFormSchema(t: TranslateForm) {
  return z.object({
    code: z.string().trim().min(1, t("sectionCodeRequired")),
    description: z.string().trim().min(1, t("sectionDescriptionRequired")),
  });
}

export type SectionFormValues = z.infer<
  ReturnType<typeof createSectionFormSchema>
>;

export function createActionFormSchema(t: TranslateForm) {
  return z.object({
    code: z.string().trim().min(1, t("actionCodeRequired")),
    description: z.string().trim().min(1, t("actionDescriptionRequired")),
  });
}

export type ActionFormValues = z.infer<
  ReturnType<typeof createActionFormSchema>
>;

export function createTaskFormSchema(t: TranslateForm) {
  return z.object({
    code: z.string().trim().min(1, t("validationError")),
    name: z.string().trim().min(1, t("validationError")),
  });
}

export type TaskFormValues = z.infer<ReturnType<typeof createTaskFormSchema>>;

export function createReportFormCreateSchema(t: TranslateForm) {
  return z.object({
    projectSharingWorkOrderId: z
      .string()
      .min(1, t("validationError")),
    name: z.string().trim().min(1, t("validationError")),
    question: z.string().trim().min(1, t("validationError")),
    value: z.string().trim().min(1, t("validationError")),
    numberOfAttachments: z.string().trim().min(1, t("validationError")),
    notes: z.string(),
  });
}

export type ReportFormCreateValues = z.infer<
  ReturnType<typeof createReportFormCreateSchema>
>;

export function createReportFormEditSchema(t: TranslateForm) {
  return z.object({
    name: z.string().trim().min(1, t("validationError")),
    question: z.string().trim().min(1, t("validationError")),
    value: z.string().trim().min(1, t("validationError")),
    numberOfAttachments: z.string().trim().min(1, t("validationError")),
    notes: z.string(),
  });
}

export type ReportFormEditValues = z.infer<
  ReturnType<typeof createReportFormEditSchema>
>;

/** Link one work order to one task (tasks-setting create/edit forms) */
export function createTaskSettingLinkFormSchema(t: TranslateForm) {
  return z.object({
    projectSharingWorkOrderId: z.string().min(1, t("validationError")),
    projectSharingTaskId: z.string().min(1, t("validationError")),
  });
}

export type TaskSettingLinkFormValues = z.infer<
  ReturnType<typeof createTaskSettingLinkFormSchema>
>;
