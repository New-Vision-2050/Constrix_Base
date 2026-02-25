import { _m, MessagesGroup } from "../../types";

export const pricesOffersMessages = new MessagesGroup({
  searchFilter: new MessagesGroup({
    title: _m("Search Filter", "فلتر البحث"),
    referenceNumber: _m("Reference Number", "رقم مرجعي"),
    offerNumber: _m("Offer Number", "رقم العرض"),
    offerStatus: _m("Offer Status", "حالة العرض"),
    endDate: _m("End Date", "تاريخ الانتهاء"),
    responsiblePerson: _m("Responsible Person", "المسؤول"),
    all: _m("All", "الكل"),
  }),
  table: new MessagesGroup({
    referenceNumber: _m("Reference Number", "الرقم المرجعي"),
    offerName: _m("Offer Name", "اسم العرض"),
    clientName: _m("Client Name", "اسم العميل"),
    department: _m("Department", "الادارة التابع لها"),
    financialResponsible: _m("Financial Responsible", "المسؤول المالي"),
    offerStatus: _m("Offer Status", "حالة العرض"),
    mediator: _m("Mediator", "الوسيط"),
    attachments: _m("Attachments", "مرفقات"),
    actions: _m("Actions", "الاجراءات"),
    action: _m("Action", "الاجراء"),
    report: _m("Report", "تقرير"),
    createOffer: _m("Create Offer Price", "إنشاء عرض سعر"),
    sort: _m("Sort", "ترتیب"),
    accepted: _m("Accepted", "مقبول"),
    pending: _m("Pending", "قيد النتظار"),
    rejected: _m("Rejected", "مرفوض"),
  }),
});
