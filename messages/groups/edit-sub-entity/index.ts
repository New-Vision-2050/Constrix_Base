import { _m, MessagesGroup } from "../../types";

export const editSubEntityMessages = new MessagesGroup({
  // Edit Form Titles
  EditClientData: _m("Edit Client Data", "تعديل بيانات العميل"),
  EditBrokerData: _m("Edit Broker Data", "تعديل بيانات الوسيط"),
  EditEmployeeData: _m("Edit Employee Data", "تعديل بيانات الموظف"),

  // Common Fields
  Email: _m("Email", "البريد الإلكتروني"),
  Name: _m("Name", "الاسم"),
  Phone: _m("Phone Number", "رقم الجوال"),
  IdentityNumber: _m("Identity Number", "رقم الهوية"),

  // Branch Related
  Branches: _m("Branches", "الفروع"),
  SelectBranches: _m("Select Branches", "اختر الفروع"),
  Branch: _m("Branch", "الفرع"),
  SelectBranch: _m("Select Branch", "اختر الفرع"),

  // Broker Related
  Broker: _m("Broker", "الوسيط"),
  SelectBroker: _m("Select Broker", "اختر الوسيط"),

  // Correspondence
  CorrespondenceAddress: _m("Correspondence Address", "عنوان المراسلات"),

  // Employee Specific Fields
  FirstName: _m("First Name", "اسم الموظف الأول"),
  LastName: _m("Last Name", "اسم الموظف الأخير"),
  Nationality: _m("Nationality", "الجنسية"),
  SelectNationality: _m("Select Nationality", "اختر الجنسية"),
  JobTitle: _m("Job Title", "المسمى الوظيفي"),
  SelectJobTitle: _m("Select Job Title", "اختر المسمى الوظيفي"),

  // Status
  EmployeeStatus: _m("Employee Status", "حالة الموظف"),
  SelectEmployeeStatus: _m("Select Employee Status", "اختر حالة الموظف"),
  Active: _m("Active", "نشط"),
  Inactive: _m("Inactive", "غير نشط"),

  // Form Actions
  Save: _m("Save", "حفظ"),
  Cancel: _m("Cancel", "إلغاء"),
  Reset: _m("Reset", "إعادة تعيين"),
});