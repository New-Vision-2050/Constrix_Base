"use client";

export const SETTINGS_TABS = [
  { value: "determinant-details", label: "معلومات المحدد" },
  { value: "timing-settings", label: "اعدادات التوقيت" },
  { value: "employees-settings", label: "اعدادات الموظفين" },
  { value: "maps-settings", label: "اعدادات الخرائط" },
  { value: "notifications-settings", label: "اعدادات الإشعارات" },
];

export const WEEK_DAYS = [
  { id: "saturday", label: "السبت" },
  { id: "sunday", label: "الاحد" },
  { id: "monday", label: "الاثنين" },
  { id: "tuesday", label: "الثلاثاء" },
  { id: "wednesday", label: "الاربعاء" },
  { id: "thursday", label: "الخميس" },
  { id: "friday", label: "الجمعة" },
];

export const EMPLOYEE_OPTIONS = [
  {
    id: "lateBefore",
    value: "1 س",
    label: "تحديد وقت ليتم الخصم قبل بدأ الدوام",
  },
  { id: "annualVacations", value: "0 موظف", label: "إجازات السنويات" },
  { id: "workHours", value: "1 س", label: "الحد الأقصى للساعات" },
  { id: "delayTotal", value: "1 د 15", label: "إجمالي دقائق المجموع" },
  { id: "workHoursCount", value: "1 س", label: "عدد ساعات العمل" },
  { id: "allowancePeriod", value: "2 س", label: "فترة السماح" },
  {
    id: "earlyLeaveThreshold",
    value: "1 د 15",
    label: "تحديد وقت ليتم الخصم بعد إنهاء الدوام",
  },
  { id: "monthlyDelayLimit", value: "1 د 15", label: "الحد الأقصى للساعات" },
];
