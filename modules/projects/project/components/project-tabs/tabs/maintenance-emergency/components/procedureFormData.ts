import type { EmployeeTaskProcedureAttachment } from "@/services/api/employee-tasks";

export const FORM_DATA_LABELS: Record<string, { en: string; ar: string }> = {
  notification_type: { en: "Notification Type", ar: "نوع الإشعار" },
  feeder_number: { en: "Feeder Number", ar: "رقم المغذي" },
  machine_number: { en: "Machine Number", ar: "رقم المعدة" },
  work_description: { en: "Work Description", ar: "وصف العمل" },
  contractor_name: { en: "Contractor Name", ar: "اسم المقاول" },
  contractor_technical_name: { en: "Contractor Technical Name", ar: "الاسم الفني للمقاول" },
  permit_source: { en: "Permit Source", ar: "مصدر التصريح" },
  permit_recipient: { en: "Permit Recipient", ar: "مستلم التصريح" },
  task_latitude: { en: "Latitude", ar: "خط العرض" },
  task_longitude: { en: "Longitude", ar: "خط الطول" },
  notes: { en: "Notes", ar: "ملاحظات" },
  update_date: { en: "Update Date", ar: "تاريخ التحديث" },
  update_time: { en: "Update Time", ar: "وقت التحديث" },
  site_status_id: { en: "Site Status", ar: "حالة الموقع" },
  current_site_status_id: { en: "Current Site Status", ar: "الحالة الحالية للموقع" },
  work_stages_completed: { en: "Work Stages Completed", ar: "مراحل العمل المنجزة" },
  current_status_description: { en: "Current Status Description", ar: "وصف الحالة الحالية" },
  completion_percentage: { en: "Completion Percentage", ar: "نسبة الإنجاز" },
  updates_obstacles: { en: "Obstacles", ar: "المعوقات" },
  additional_notes: { en: "Additional Notes", ar: "ملاحظات إضافية" },
  reason: { en: "Reason", ar: "السبب" },
  total_amount: { en: "Total Amount", ar: "المبلغ الإجمالي" },
  latitude: { en: "Latitude", ar: "خط العرض" },
  longitude: { en: "Longitude", ar: "خط الطول" },
  distance_meters: { en: "Distance (m)", ar: "المسافة (متر)" },
  is_inside_location: { en: "Inside Location", ar: "داخل النطاق" },
  other_notes: { en: "Other Notes", ar: "ملاحظات أخرى" },
  reasons_resolved: { en: "Reasons Resolved", ar: "تم حل الأسباب" },
  safety_notes_reviewed: { en: "Safety Notes Reviewed", ar: "تم مراجعة ملاحظات السلامة" },
  site_ready: { en: "Site Ready", ar: "الموقع جاهز" },
  contractor_notified: { en: "Contractor Notified", ar: "تم إبلاغ المقاول" },
  new_task_date: { en: "New Task Date", ar: "تاريخ المهمة الجديد" },
  new_task_time: { en: "New Task Time", ar: "وقت المهمة الجديد" },
};

export const FORM_DISPLAY_NAMES: Record<string, { en: string; ar: string }> = {
  createProjectNotificationTask: { en: "Create Project Notification", ar: "إنشاء إشعار مشروع" },
  updateProjectNotificationTask: { en: "Update Notification Data", ar: "تحديث بيانات الإشعار" },
  updateProjectNotificationSiteStatus: { en: "Periodic Site Status Update", ar: "التحديث الدوري لحالة الموقع" },
  projectNotificationFine: { en: "Fine Items", ar: "بنود الغرامة" },
  confirmProjectNotificationLocation: { en: "Confirm Site Presence", ar: "تأكيد التواجد في الموقع" },
  projectNotificationWorkStoppageReport: { en: "Work Stoppage Report", ar: "محضر إيقاف أعمال" },
  projectNotificationWorkResumption: { en: "Work Resumption", ar: "استئناف الأعمال" },
  projectNotificationTaskPostponement: { en: "Task Postponement", ar: "تأجيل المهمة" },
  endProjectNotificationTask: { en: "End Task", ar: "إنهاء المهمة" },
};

export function getFormDataLabel(key: string, isRTL: boolean): string {
  const entry = FORM_DATA_LABELS[key];
  if (!entry) return key;
  return isRTL ? entry.ar : entry.en;
}

export function getFormDisplayName(form: string, isRTL: boolean): string {
  const entry = FORM_DISPLAY_NAMES[form];
  if (!entry) return form;
  return isRTL ? entry.ar : entry.en;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatFormDataValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "✓" : "✗";
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === "object" ? JSON.stringify(item) : String(item)
      ).join(", ");
    }
    return JSON.stringify(value);
  }
  return String(value);
}

export function isImageAttachment(att: EmployeeTaskProcedureAttachment): boolean {
  return att.type === "image" || (att.mime_type?.startsWith("image/") ?? false);
}

export function isDocumentAttachment(att: EmployeeTaskProcedureAttachment): boolean {
  return att.type === "document" || (att.mime_type?.startsWith("application/") ?? false);
}
