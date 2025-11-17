import { _m, MessagesGroup } from "../../types";

export const hrSettingsMessages = new MessagesGroup({
  tabs: new MessagesGroup({
    attendance: _m("Attendance & Departure", "الحضور و الانصراف"),
    recruitment: _m("Recruitment", "التوظيف"),
    vacations: _m("Holidays and vacations", "الإجازات و العطلات"),
    service: _m("Service", "الخدمة"),
    contractManagement: _m("Contract Management", "ادارة عقد العمل")
  }),
  statistics: new MessagesGroup({
    totalAttendance: _m("Total Attendance", "إجمالي عدد الحضور"),
    totalDeparture: _m("Total Departures", "إجمالي عدد الانصراف"),
    totalAbsence: _m("Total Absences", "إجمالي عدد الغياب"),
    vacations: _m("Vacations", "الإجازات"),
    loading: _m("Loading statistics...", "جاري تحميل الإحصائيات..."),
    error: _m("Error loading statistics", "خطأ في تحميل الإحصائيات")
  })
});
