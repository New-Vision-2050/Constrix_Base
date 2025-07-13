import { AttendanceDeterminant } from "../../../types/attendance-departure";

// Determinants list
export const DETERMINANTS_LIST: AttendanceDeterminant[] = [
  {
    id: "cairo-branch",
    name: "محدد فرع",
    location: "القاهرة",
    status: true,
    active: true,
    details: {
      title: "فرع القاهرة",
      systemType: "نظام البصمة",
      systemStatus: "منتظم",
      workHours: 8,
      workDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
      branches: ["جدة", "الرياض"]
    }
  },
  {
    id: "jeddah-branch",
    name: "محدد فرع",
    location: "جدة",
    status: true,
    active: false,
    details: {
      title: "فرع جدة",
      systemType: "نظام البصمة",
      systemStatus: "منتظم",
      workHours: 8,
      workDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
      branches: ["جدة", "الرياض"]
    }
  },
  {
    id: "qassim-branch",
    name: "محدد فرع",
    location: "القصيم",
    status: true,
    active: false,
    details: {
      title: "فرع القصيم",
      systemType: "نظام البصمة",
      systemStatus: "منتظم",
      workHours: 8,
      workDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
      branches: ["جدة", "الرياض"]
    }
  },
  {
    id: "dammam-branch",
    name: "محدد فرع",
    location: "الدمام",
    status: true,
    active: false,
    details: {
      title: "فرع الدمام",
      systemType: "نظام البصمة",
      systemStatus: "منتظم",
      workHours: 8,
      workDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
      branches: ["جدة", "الرياض"]
    }
  },
  {
    id: "riyadh-branch",
    name: "محدد فرع",
    location: "الرياض",
    status: false,
    active: false,
    details: {
      title: "فرع الرياض",
      systemType: "نظام البصمة",
      systemStatus: "غير منتظم",
      workHours: 6,
      workDays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
      branches: ["جدة"]
    }
  }
];
