export const WEEK_DAYS = [
  { id: "saturday", label: "السبت" },
  { id: "sunday", label: "الأحد" },
  { id: "monday", label: "الاثنين" },
  { id: "tuesday", label: "الثلاثاء" },
  { id: "wednesday", label: "الأربعاء" },
  { id: "thursday", label: "الخميس" },
  { id: "friday", label: "الجمعة" },
];

export type ConstraintRuleField =
  | "early_clock_in_minutes"
  | "out_zone_minutes"
  | "max_over_time"
  | "extension_minutes"
  | "can_clock_in_before";

export type ConstraintRuleToggleField =
  | "is_overtime_before_early_clock_in"
  | "is_overtime_after_extension_hours_shift"
  | "is_after_finish_working_hours";

export type ConstraintRuleOption = {
  id: ConstraintRuleField;
  amount: number;
  unit: string;
  label: string;
};

export type ConstraintRuleToggleOption = {
  id: ConstraintRuleToggleField;
  label: string;
};

export const CONSTRAINT_RULE_OPTIONS: ConstraintRuleOption[] = [
  {
    id: "early_clock_in_minutes",
    amount: 30,
    unit: "د",
    label: "تحديد وقت تبصيم الدخول قبل بدأ الدوام",
  },
  {
    id: "out_zone_minutes",
    amount: 15,
    unit: "د",
    label: "خارج نطاق الموقع",
  },
  {
    id: "max_over_time",
    amount: 240,
    unit: "د",
    label: "الحد الاقصى للوقت الإضافي",
  },
  {
    id: "extension_minutes",
    amount: 120,
    unit: "د",
    label: "وقت الامتداد بعد نهاية الدوام",
  },
  {
    id: "can_clock_in_before",
    amount: 60,
    unit: "د",
    label: "الحد الأقصى لتسجيل الحضور بعد بدء الدوام",
  },
];

export const CONSTRAINT_RULE_TOGGLE_OPTIONS: ConstraintRuleToggleOption[] = [
  {
    id: "is_overtime_before_early_clock_in",
    label: "احتساب وقت إضافي قبل فترة الحضور المبكر",
  },
  {
    id: "is_overtime_after_extension_hours_shift",
    label: "احتساب وقت إضافي بعد ساعات الامتداد",
  },
  {
    id: "is_after_finish_working_hours",
    label: "احتساب وقت إضافي بعد اكتمال ساعات العمل",
  },
];
