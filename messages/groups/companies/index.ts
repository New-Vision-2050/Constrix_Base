import { _m, MessagesGroup } from "../../types";

export const companiesMessages = new MessagesGroup({
  Companies: _m("Companies", "الشركات"),
  Edit: _m("Edit", "تعديل"),
  Email: _m("Email", "البريد الالكتروني"),
  CompanyType: _m("Company Type", "نوع الشركة"),
  CompanySection: _m("Company Section", "نشاط الشركه"),
  Manager: _m("Manager", "المسؤول"),
  DataStatus: _m("Data Status", "حالة البيانات"),
  Status: _m("Status", "الحالة"),
  Actions: _m("Actions", "الاجراء"),
  CountryFilter: _m("Company Country", "دولة الشركة"),
  TypeFilter: _m("Company Type", "نوع الشركة"),
  Active: _m("Active", "نشط"),
  Inactive: _m("Inactive", "غير نشط"),
  LoginAsManager: _m("Login as Company Manager (Edit)", "الدخول كـ مدير شركة (تعديل)"),
  completeProfileData: _m("complete profile data", "أستكمال بيانات"),
  PackageSettings: _m("Package and Program Settings", "اعدادات الباقة والبرامج"),
  Delete: _m("Delete (Archive)", "حذف (أرشفة)"),
  Confirmation: _m("Confirmation", "تأكيد"),
  AreYouSure: _m("Are you sure?", "هل أنت متأكد؟"),
  AreYouSureReactivate: _m("Do you want to confirm activating the company?", "هل تريد تاكيد تنشيط الشركة؟"),
  AreYouSureDeactivate: _m("Do you want to confirm deactivating the company?", "هل تريد تاكيد الغاء تنشيط الشركة؟"),
  DeleteConfirmMessage: _m("Are you sure you want to delete this company?", "هل أنت متأكد من حذف هذه الشركة؟"),
  createCompany: _m("Create Company", "انشاء شركة"),
  SaveCompany: _m("The company was saved with number", "تم حفظ الشركة برقم"),
  Validation: new MessagesGroup({
    arabicName: _m("The name should be in Arabic letters", "الاسم التجاري يجب ان يكون باللغه العربية"),
    englishName: _m("Short name should be in English", "الاسم المختصر يجب ان يكون باللغه الانجليزية"),
    arabicFirstName: _m("The first name should be in Arabic letters", "اسم المستخدم الاول يجب ان يكون باللغه العربية"),
    arabicLastName: _m("The last name should be in Arabic letters", "اسم المستخدم الأخير يجب ان يكون باللغه العربية")
  })
});
