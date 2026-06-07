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
  | "max_working_hours"
  | "early_clock_in_minutes"
  | "out_zone_minutes"
  | "lateness_minutes"
  | "max_over_time";

export type ConstraintRuleOption = {
  id: ConstraintRuleField;
  amount: number;
  unit: string;
  label: string;
};

export const CONSTRAINT_RULE_OPTIONS: ConstraintRuleOption[] = [
  {
    id: "max_working_hours",
    amount: 9,
    unit: "س",
    label: "عدد ساعات العمل",
  },
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
    id: "lateness_minutes",
    amount: 15,
    unit: "د",
    label: "فترة السماح",
  },
  {
    id: "max_over_time",
    amount: 4,
    unit: "س",
    label: "الحد الاقصى للساعات الإضافية",
  },
];
