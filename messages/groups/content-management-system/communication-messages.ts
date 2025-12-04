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
  reply: _m("Reply", "رد"),
  details: _m("Details", "التفاصيل"),
  delete: _m("Delete", "حذف"),
  // Reply dialog
  replyDialog: new MessagesGroup({
    title: _m("Reply to Message", "الرد على الرسالة"),
    replyLabel: _m("Reply", "الرد"),
    replyPlaceholder: _m(
      "Enter your reply...",
      "أدخل ردك..."
    ),
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

