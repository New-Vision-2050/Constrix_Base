import { MessagesGroup, _m } from "../../types";

export const projectShareTabMessages = new MessagesGroup({
  searchPlaceholder: _m("Search shares", "البحث في المشاركات"),
  sort: _m("Sort", "ترتيب"),
  inviteCompany: _m("Invite company", "دعوة شركة"),
  loadError: _m(
    "An error occurred while loading data",
    "حدث خطأ أثناء تحميل البيانات",
  ),
  emptyDash: _m("—", "—"),
  table: new MessagesGroup({
    companyName: _m("Company name", "اسم الشركة"),
    type: _m("Type", "النوع"),
    relation: _m("Relation", "العلاقة"),
    role: _m("Role", "الدور"),
    email: _m("Email", "البريد الإلكتروني"),
    mobile: _m("Mobile number", "رقم الجوال"),
    sharedBy: _m("Company representative", "ممثل الشركة"),
    sentDate: _m("Sent date", "تاريخ الإرسال"),
    requestStatus: _m("Request status", "حالة الطلب"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "إجراء"),
    edit: _m("Edit", "تعديل"),
  }),
  status: new MessagesGroup({
    pending: _m("Awaiting response", "بانتظار الرد"),
    sent: _m("Sent", "تم الإرسال"),
    draft: _m("Under construction", "تحت الإنشاء"),
    under_construction: _m("Under construction", "تحت الإنشاء"),
    accepted: _m("Accepted", "مقبول"),
    approved: _m("Approved", "مقبول"),
    rejected: _m("Rejected", "مرفوض"),
  }),
  widgets: new MessagesGroup({
    awaiting: _m("Awaiting response", "بانتظار الرد"),
    rejected: _m("Rejected", "مرفوض"),
    accepted: _m("Accepted", "مقبول"),
    inProgress: _m("In progress", "قيد المعالجة"),
    total: _m("Total", "الإجمالي"),
  }),
});
