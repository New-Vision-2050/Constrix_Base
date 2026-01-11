import { MessagesGroup, _m } from "@/messages";

export const CommunicationMessagesMessages = new MessagesGroup({
  title: _m("Communication Messages", "رسائل التواصل"),
  noMessages: _m("No messages found", "لم يتم إيجاد رسائل"),
  // Table columns
  name: _m("Name", "الاسم"),
  email: _m("Email", "البريد الإلكتروني"),
  phone: _m("Phone", "رقم الهاتف"),
  address: _m("Address", "العنوان"),
  message: _m("Message", "الرسالة"),
  status: _m("Status", "الحالة"),
  createdAt: _m("Date", "التاريخ"),
  // Status values
  pending: _m("Pending", "قيد الانتظار"),
  replied: _m("Replied", "تم الرد"),
  // Actions
  actions: _m("Actions", "الإجراءات"),
  action: _m("Action", "الإجراء"),
  reply: _m("Reply", "رد"),
  details: _m("Details", "التفاصيل"),
  delete: _m("Delete", "حذف"),
  deleteSuccess: _m("Message deleted successfully", "تم حذف الرسالة بنجاح"),
  deleteError: _m("Failed to delete message", "فشل حذف الرسالة"),
  deleteConfirmMessage: _m(
    "Are you sure you want to delete this message?",
    "هل أنت متأكد من حذف هذه الرسالة؟"
  ),
  // Filters
  searchPlaceholder: _m(
    "Search by name, email or message...",
    "البحث بالاسم أو البريد الإلكتروني أو الرسالة..."
  ),
  allStatus: _m("All Status", "جميع الحالات"),
  reset: _m("Reset", "إعادة تعيين"),
  // Reply dialog
  replyDialog: new MessagesGroup({
    title: _m("Reply to Message", "الرد على الرسالة"),
    replyLabel: _m("Reply", "الرد"),
    replyPlaceholder: _m("Enter your reply...", "أدخل ردك..."),
    status: _m("Status", "الحالة"),
    send: _m("Send", "إرسال"),
    cancel: _m("Cancel", "إلغاء"),
    success: _m("Reply sent successfully!", "تم إرسال الرد بنجاح!"),
    error: _m("Failed to send reply", "فشل إرسال الرد"),
  }),
  // Details dialog
  detailsDialog: new MessagesGroup({
    title: _m("Message Details", "تفاصيل الرسالة"),
    close: _m("Close", "إغلاق"),
  }),
});
