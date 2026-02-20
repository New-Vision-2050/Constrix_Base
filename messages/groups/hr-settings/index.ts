import { _m, MessagesGroup } from "../../types";
import { hrSettingsInsuranceMessages } from "./insurance";

export const hrSettingsMessages = new MessagesGroup({
  tabs: new MessagesGroup({
    attendance: _m("Attendance & Departure", "الحضور و الانصراف"),
    recruitment: _m("Recruitment", "التوظيف"),
    vacations: _m("Holidays and vacations", "الإجازات و العطلات"),
    service: _m("Service", "الخدمة"),
    insuranceCompany: _m("Insurance Company", "شركه التامين"),
    contractManagement: _m("Contract Management", "ادارة عقد العمل")
  }),
  insurance: new MessagesGroup({
    addPolicy: _m("Add Policy", "إضافة بوليصة"),
    policyNumber: _m("Policy Number", "رقم البوليصة"),
    responsiblePerson: _m("Responsible Person", "المسؤول"),
    expiryDate: _m("Expiry Date", "تاريخ الانتهاء"),
    add: _m("Add", "إضافة"),
    edit: _m("Edit", "تعديل"),
    clear: _m("Clear", "مسح"),
    delete: _m("Delete", "حذف"),
    policyList: _m("Policy List", "قائمة البوالص"),
    selectResponsible: _m("Select Responsible", "اختر المسؤول"),
    enterPolicyNumber: _m("Enter Policy Number", "أدخل رقم البوليصة"),
    addPolicyButton: _m("Add Policy", "إضافة بوليصة"),
    noPolicies: _m("No Policies Found", "لا توجد بوالص"),
    actions: _m("Actions", "إجراءات"),
    action: _m("Action", "إجراء"),
    status: _m("Status", "الحالة"),
    active: _m("Active", "نشط"),
    inactive: _m("Inactive", "غير نشط"),
    addSuccess: _m("Policy added successfully", "تم إضافة البوليصة بنجاح"),
    updateSuccess: _m("Policy updated successfully", "تم تحديث البوليصة بنجاح"),
    deleteSuccess: _m("Policy deleted successfully", "تم حذف البوليصة بنجاح"),
    saveError: _m("Error saving policy", "خطأ في حفظ البوليصة"),
    deleteError: _m("Error deleting policy", "خطأ في حذف البوليصة"),
    deleteConfirmMessage: _m("Are you sure you want to delete this policy?", "هل أنت متأكد من حذف هذه البوليصة؟"),
    allFieldsRequired: _m("All fields are required", "يرجى ملء جميع الحقول"),
    addNewPolicy: _m("Add New Policy", "إضافة بوليصة جديدة"),
    editPolicy: _m("Edit Policy", "تعديل البوليصة"),
    update: _m("Update", "تحديث")
  }),
  insurance: hrSettingsInsuranceMessages,
  statistics: new MessagesGroup({
    totalAttendance: _m("Total Attendance", "إجمالي عدد الحضور"),
    totalDeparture: _m("Total Departures", "إجمالي عدد الانصراف"),
    totalAbsence: _m("Total Absences", "إجمالي عدد الغياب"),
    vacations: _m("Vacations", "الإجازات"),
    loading: _m("Loading statistics...", "جاري تحميل الإحصائيات..."),
    error: _m("Error loading statistics", "خطأ في تحميل الإحصائيات")
  })
});
