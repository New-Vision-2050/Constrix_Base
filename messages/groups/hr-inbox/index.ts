import { _m, MessagesGroup } from "../../types";

export const hrInboxMessages = new MessagesGroup({
  title: _m("Inbox", "صندوق الوارد"),
  description: _m(
    "Review employee tasks assigned to you.",
    "راجع مهمات العمل الموجهة إليك.",
  ),
  colSerial: _m("Serial", "الرقم التسلسلي"),
  colTitle: _m("Task", "المهمة"),
  colEmployee: _m("Employee", "الموظف"),
  colStatus: _m("Status", "الحالة"),
  colTaskDate: _m("Task date", "تاريخ المهمة"),
  colDuration: _m("Duration", "المدة"),
  colCurrentStep: _m("Current step", "الخطوة الحالية"),
  colApprovers: _m("Approvers", "المعتمدون"),
  colCreated: _m("Created", "تاريخ الإنشاء"),
  detailsTitle: _m("Task details", "تفاصيل المهمة"),
  detailsEmpty: _m("No task selected.", "لم يتم اختيار مهمة."),
  viewDetails: _m("View details", "عرض التفاصيل"),
  colType: _m("Type", "النوع"),
  detailLocation: _m("Location", "الموقع"),
  detailNotes: _m("Notes", "الملاحظات"),
  detailTimeFrom: _m("Time from", "وقت البداية"),
  detailTimeTo: _m("Time to", "وقت النهاية"),
  dash: _m("—", "—"),
  detailLocationSummary: _m(
    "{lat}, {lng} (radius {radius} m)",
    "{lat}, {lng} (نصف القطر {radius} م)",
  ),
  loadError: _m(
    "Could not load inbox. Try again later.",
    "تعذر تحميل صندوق الوارد. حاول لاحقاً.",
  ),
  approve: _m("Approve", "موافقة"),
  reject: _m("Reject", "رفض"),
  rejectDialogTitle: _m("Reject task", "رفض المهمة"),
  rejectReason: _m("Rejection reason", "سبب الرفض"),
  rejectReasonHelper: _m(
    "Required to reject this task.",
    "مطلوب لرفض هذه المهمة.",
  ),
  toastApproveSuccess: _m("Task approved.", "تمت الموافقة على المهمة."),
  toastRejectSuccess: _m("Task rejected.", "تم رفض المهمة."),
  toastOperationError: _m(
    "Something went wrong. Try again.",
    "حدث خطأ. حاول مرة أخرى.",
  ),
});
