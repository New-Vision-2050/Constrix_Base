export type SafetyReportStatus = "in_progress" | "completed" | "late";

export type SafetyReportRow = {
  id: string;
  orderNumber: string;
  orderStatus: SafetyReportStatus;
  orderStatusLabel?: string;
  safetyVisitsCount: number;
  observationsCount: number;
  siteVisitFormsCount: number;
  contractorName: string;
  consultantName: string;
  engineerName: string;
};

export type SafetyReportFilters = {
  orderNumber: string;
  contractor: string;
  consultant: string;
  engineer: string;
};

export const EMPTY_SAFETY_REPORT_FILTERS: SafetyReportFilters = {
  orderNumber: "",
  contractor: "",
  consultant: "",
  engineer: "",
};

export const MOCK_SAFETY_REPORTS: SafetyReportRow[] = [
  {
    id: "1",
    orderNumber: "NTF-0002",
    orderStatus: "in_progress",
    safetyVisitsCount: 12,
    observationsCount: 2,
    siteVisitFormsCount: 8,
    contractorName: "مقاولات المستقبل",
    consultantName: "دار البيان للاستشارات",
    engineerName: "م. أحمد سعيد",
  },
  {
    id: "2",
    orderNumber: "NTF-0003",
    orderStatus: "completed",
    safetyVisitsCount: 9,
    observationsCount: 1,
    siteVisitFormsCount: 6,
    contractorName: "شركة عوض للمقاولات",
    consultantName: "ابعاد الرؤية",
    engineerName: "م. خالد العتيبي",
  },
  {
    id: "3",
    orderNumber: "NTF-0004",
    orderStatus: "late",
    safetyVisitsCount: 5,
    observationsCount: 4,
    siteVisitFormsCount: 3,
    contractorName: "شركة البناء الحديث",
    consultantName: "مكتب الهندسة المتقدمة",
    engineerName: "م. سارة الحربي",
  },
  {
    id: "4",
    orderNumber: "NTF-0005",
    orderStatus: "in_progress",
    safetyVisitsCount: 7,
    observationsCount: 0,
    siteVisitFormsCount: 5,
    contractorName: "شركة المشاريع المتحدة",
    consultantName: "استشارات التقنية",
    engineerName: "م. فهد الدوسري",
  },
  {
    id: "5",
    orderNumber: "NTF-0006",
    orderStatus: "completed",
    safetyVisitsCount: 11,
    observationsCount: 3,
    siteVisitFormsCount: 9,
    contractorName: "مقاولات المستقبل",
    consultantName: "دار البيان للاستشارات",
    engineerName: "م. أحمد سعيد",
  },
  {
    id: "6",
    orderNumber: "NTF-0007",
    orderStatus: "late",
    safetyVisitsCount: 4,
    observationsCount: 5,
    siteVisitFormsCount: 2,
    contractorName: "شركة عوض للمقاولات",
    consultantName: "ابعاد الرؤية",
    engineerName: "م. خالد العتيبي",
  },
  {
    id: "7",
    orderNumber: "NTF-0008",
    orderStatus: "in_progress",
    safetyVisitsCount: 8,
    observationsCount: 1,
    siteVisitFormsCount: 7,
    contractorName: "شركة البناء الحديث",
    consultantName: "مكتب الهندسة المتقدمة",
    engineerName: "م. سارة الحربي",
  },
  {
    id: "8",
    orderNumber: "NTF-0009",
    orderStatus: "completed",
    safetyVisitsCount: 10,
    observationsCount: 2,
    siteVisitFormsCount: 8,
    contractorName: "شركة المشاريع المتحدة",
    consultantName: "استشارات التقنية",
    engineerName: "م. فهد الدوسري",
  },
  {
    id: "9",
    orderNumber: "NTF-0010",
    orderStatus: "in_progress",
    safetyVisitsCount: 6,
    observationsCount: 3,
    siteVisitFormsCount: 4,
    contractorName: "مقاولات المستقبل",
    consultantName: "دار البيان للاستشارات",
    engineerName: "م. أحمد سعيد",
  },
  {
    id: "10",
    orderNumber: "NTF-0011",
    orderStatus: "late",
    safetyVisitsCount: 3,
    observationsCount: 6,
    siteVisitFormsCount: 2,
    contractorName: "شركة عوض للمقاولات",
    consultantName: "ابعاد الرؤية",
    engineerName: "م. خالد العتيبي",
  },
  {
    id: "11",
    orderNumber: "NTF-0012",
    orderStatus: "completed",
    safetyVisitsCount: 13,
    observationsCount: 1,
    siteVisitFormsCount: 10,
    contractorName: "شركة البناء الحديث",
    consultantName: "مكتب الهندسة المتقدمة",
    engineerName: "م. سارة الحربي",
  },
  {
    id: "12",
    orderNumber: "NTF-0013",
    orderStatus: "in_progress",
    safetyVisitsCount: 9,
    observationsCount: 2,
    siteVisitFormsCount: 6,
    contractorName: "شركة المشاريع المتحدة",
    consultantName: "استشارات التقنية",
    engineerName: "م. فهد الدوسري",
  },
  {
    id: "13",
    orderNumber: "NTF-0014",
    orderStatus: "completed",
    safetyVisitsCount: 14,
    observationsCount: 0,
    siteVisitFormsCount: 11,
    contractorName: "مقاولات المستقبل",
    consultantName: "دار البيان للاستشارات",
    engineerName: "م. أحمد سعيد",
  },
];
