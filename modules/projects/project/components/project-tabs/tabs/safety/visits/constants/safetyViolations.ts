export type SafetyViolationDefinition = {
  code: string;
  description: string;
  category: "A" | "B" | "C";
  defaultWeight: number;
};

export const SAFETY_VIOLATIONS_CATALOG: SafetyViolationDefinition[] = [
  {
    code: "1-19-2-1",
    description: "عدم حمل بطاقة التعميد والتأهيل في موقع العمل",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "2-19-2-1",
    description: "مخالفة عدم تأهيل سائق معدات",
    category: "B",
    defaultWeight: 2,
  },
  {
    code: "3-19-2-1",
    description: "عدم تدريب الموظفين على إجراءات العمل الآمن...",
    category: "B",
    defaultWeight: 2,
  },
  {
    code: "4-19-2-1",
    description: "البدء بالعمل دون تركيب أقفال السلامة المعتمدة",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "5-19-2-1",
    description: "عدم وجود البطاقات التحذيرية",
    category: "B",
    defaultWeight: 2,
  },
  {
    code: "6-19-2-1",
    description: "عدم الالتزام بمسافة الخلوص الآمنة للخطوط الهوائية",
    category: "B",
    defaultWeight: 2,
  },
  {
    code: "7-19-2-1",
    description: "العمل من دون تصريح عمل",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "8-19-2-1",
    description: "عدم ارتداء ملابس الحماية من السقوط",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "9-19-2-1",
    description: "عدم ارتداء مهمات الوقاية الشخصية",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "10-19-2-1",
    description: "عدم توفير مصدر تغذية آمن",
    category: "B",
    defaultWeight: 2,
  },
  {
    code: "11-19-2-1",
    description: "استخدام عدد يدوية غير معزولة",
    category: "B",
    defaultWeight: 2,
  },
  {
    code: "12-19-2-1",
    description: "استخدام حواجز حماية تالفة",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "13-19-2-1",
    description: "عدم وضع حواجز الحماية في أماكنها الصحيحة",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "14-19-2-1",
    description: "عدم وضع حواجز وإشارات مرورية...",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "15-19-2-1",
    description: "عدم تسجيل الحمل الأقصى الآمن على معدات السلامة",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "16-19-2-1",
    description: "عدم سلامة المركبات",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "17-19-2-1",
    description: "عدم سلامة المعدات",
    category: "B",
    defaultWeight: 0,
  },
  {
    code: "18-19-2-1",
    description: "عدم توفير طفايات حريق صالحة ومفحوصة",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "19-19-2-1",
    description: "عدم وجود مسعف / مكافح حريق مؤهل",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "20-19-2-1",
    description: "التدخين في منطقة العمل",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "21-19-2-1",
    description: "عدم توفير حقيبة إسعافات أولية كاملة",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "22-19-2-1",
    description: "عدم وجود الشعار الخاص بالمقاول",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "23-19-2-1",
    description: "عدم إزالة المخلفات بعد الانتهاء من العمل",
    category: "C",
    defaultWeight: 0,
  },
  {
    code: "24-19-2-1",
    description: "عدم تطبيق أنظمة السلامة على مستودع المقاول",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "25-19-2-1",
    description: "عدم توفير مظلة للعاملين داخل الغرفة في الجو الحار",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "26-19-2-1",
    description: "عدم توفر مياه شرب كافية",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "27-19-2-1",
    description: "عدم سند جوانب الحفر العميقة",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "28-19-2-1",
    description: "عدم وضع جسور عبور مشاة فوق الحفريات",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "29-19-2-1",
    description: "عدم نقل أو تخزين المواد بطريقة جيدة",
    category: "C",
    defaultWeight: 0.5,
  },
  {
    code: "30-19-2-1",
    description: "عدم التقيد بطريقة تمديد الكابلات الأرضية",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "31-19-2-1",
    description: "عدم استخدام عمالة نظامية",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "32-19-2-1",
    description: "التعاقد مع مقاول من الباطن دون موافقة",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "33-19-2-1",
    description: "الفصل أو التوصيل لمعدات الشركة دون موافقة",
    category: "A",
    defaultWeight: 7,
  },
  {
    code: "34-19-2-1",
    description: "تخزين المواد في مستودع غير معلن للشركة",
    category: "A",
    defaultWeight: 7,
  },
];

export const SAFETY_VIOLATION_EMPTY_VALUE = "_";

export function formatViolationWeight(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/** Attached violations show API weight (may be negative); others show "_". */
export function buildViolationValues(
  apiViolations: Array<{
    code: string;
    isAttached: boolean;
    weight: number | null;
  }>,
): Record<string, string> {
  const byCode = new Map(
    apiViolations.filter((violation) => violation.code).map((violation) => [
      violation.code,
      violation,
    ]),
  );

  return SAFETY_VIOLATIONS_CATALOG.reduce<Record<string, string>>(
    (acc, definition) => {
      const received = byCode.get(definition.code);
      if (received?.isAttached && received.weight !== null) {
        acc[definition.code] = formatViolationWeight(received.weight);
      } else {
        acc[definition.code] = SAFETY_VIOLATION_EMPTY_VALUE;
      }
      return acc;
    },
    {},
  );
}
