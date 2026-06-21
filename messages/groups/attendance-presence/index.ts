import { _m, MessagesGroup } from "../../types";

export const attendancePresenceMessages = new MessagesGroup({
  title: _m("Attendance & Presence", "الحضور والتواجد"),
  description: _m(
    "Track your attendance, work hours, and daily log",
    "متابعة الحضور وساعات العمل وسجل الدوام اليومي",
  ),

  // Main tabs
  assignedTasks: _m("Assigned Tasks", "المهام المسندة"),
  attendanceLog: _m("Attendance Log", "سجل الحضور"),
  attachments: _m("Attachments", "المرفقات"),

  // Sub tabs
  attendanceAndWorkLog: _m("Attendance & Work Log", "الحضور وسجل الدوام"),
  attendanceReports: _m("Attendance Reports", "تقارير الحضور"),
  approvals: _m("Approvals", "الاعتمادات"),

  // Summary cards
  totalWorkHours: _m("Total Work Hours", "المجموع الكلي لساعات العمل"),
  thisMonth: _m("This month", "هذا الشهر"),
  hoursAndMinutes: _m(
    "{hours} hours {minutes} minutes",
    "{hours} ساعات {minutes} دقيقة",
  ),
  todayGoal: _m("Today's Goal", "هدف اليوم"),
  hours: _m("hours", "ساعات"),
  hoursCompleted: _m("hours completed", "تم انجاز ساعات"),
  currentPeriod: _m("Current Period", "الفترة الحالية"),
  currentTimeDate: _m("Current Time & Date", "الوقت والتاريخ الحالي"),
  monthSummary: _m("{month} Summary", "ملخص {month}"),

  // Status labels
  status: new MessagesGroup({
    present: _m("Present", "حاضر"),
    absent: _m("Absent", "غائب"),
    late: _m("Late", "متأخر"),
    leave: _m("Leave", "اجازة"),
    holiday: _m("Holiday", "عطلة"),
    required: _m("Required Attendance", "الحضور المطلوب"),
  }),

  // Today log
  todayLog: _m("Today's Log", "سجل اليوم"),
  period1: _m("First Period", "الفترة الأولى"),
  period2: _m("Second Period", "الفترة الثانية"),
  period3: _m("Third Period", "الفترة الثالثة"),
  timeRemaining: _m("Time Remaining", "الوقت المتبقي"),
  timeElapsed: _m("Time Elapsed", "الوقت المنقضي"),
  checkIn: _m("Check-in", "الحضور"),
  checkOut: _m("Check-out", "الانصراف"),
  workHours: _m("Work Hours", "ساعات العمل"),
  today: _m("Today", "اليوم"),
  date: _m("Date", "التاريخ"),
  statusColumn: _m("Status", "الحالة"),
  departure: _m("Departure", "الانصراف"),
  registerAttendance: _m("Register Attendance", "تسجيل حضور"),
  registerDeparture: _m("Register Departure", "تسجيل انصراف"),
  requestPermission: _m("Request Permission", "طلب اذن"),
  todayGoalLabel: _m(
    "Today's Goal: {hours} hours",
    "هدف اليوم : {hours} ساعات",
  ),

  // Attendance dialogs
  confirm: _m("Confirm", "تأكيد"),
  cancel: _m("Cancel", "إلغاء"),
  back: _m("Back", "رجوع"),
  enableLocationTitle: _m("Please enable location", "برجاء تفعيل الموقع"),
  enableLocationDescription: _m(
    "Waiting for location permission approval to record attendance.",
    "في انتظار الموافقة على صلاحيات الموقع لتسجيل الحضور.",
  ),
  currentLocationTitle: _m("My current location", "موقعي الحالي"),
  meLabel: _m("Me", "أنا"),
  outOfLocationMessage: _m(
    "Sorry, you are <bold>{distance} km</bold> away from the attendance location",
    "عفوا انت تبعد <bold>{distance} كيلو متر</bold> من موقع الحضور",
  ),
  requestWorkMission: _m("Request work mission", "طلب مهمة عمل"),
  confirmClockInTitle: _m(
    "Do you want to confirm attendance registration?",
    "هل تريد تأكيد تسجيل الحضور ؟",
  ),
  confirmClockOutTitle: _m(
    "Do you want to confirm departure registration?",
    "هل تريد تأكيد تسجيل الانصراف؟",
  ),
  clockInLateMessage: _m(
    "Attendance will be recorded with a {minutes}-minute delay",
    "سيتم تسجيل الحضور بتأخير {minutes} دقائق",
  ),
  clockInSuccessTitle: _m("Attendance registered", "تم تسجيل الحضور"),
  clockOutSuccessTitle: _m("Departure registered", "تم تسجيل الانصراف"),
  lateByMinutes: _m("Late by {minutes} minutes", "متأخر {minutes} دقائق"),
  attendanceActionError: _m(
    "Failed to complete attendance action",
    "فشل إتمام عملية الحضور",
  ),
  cannotRegisterNow: _m(
    "Attendance registration is not available right now",
    "تسجيل الحضور غير متاح حالياً",
  ),
  earlyClockInBlocked: _m(
    "You can clock in up to {minutes} minutes before shift start",
    "يمكنك تسجيل الحضور قبل بداية الفترة بـ {minutes} دقيقة فقط",
  ),

  // Work log
  workLog: _m("Work Log", "سجل الدوام"),
  calendarView: _m("Calendar View", "عرض التقويم"),
  tableView: _m("Table View", "عرض الجدول"),
  delay: _m("Delay", "التأخير"),
  notes: _m("Notes", "الملاحظات"),
  paginationRange: _m("{start}-{end} of {total}", "{start}-{end} من {total}"),
  hoursShort: _m("h", "س"),

  // Weekdays
  weekdays: new MessagesGroup({
    sun: _m("Sun", "الأحد"),
    mon: _m("Mon", "الإثنين"),
    tue: _m("Tue", "الثلاثاء"),
    wed: _m("Wed", "الأربعاء"),
    thu: _m("Thu", "الخميس"),
    fri: _m("Fri", "الجمعة"),
    sat: _m("Sat", "السبت"),
  }),

  // Placeholders
  underDevelopment: _m("Content under development...", "محتوى قيد الإنشاء..."),
  loading: _m("Loading...", "جاري التحميل..."),
  loadError: _m("Failed to load attendance data", "فشل تحميل بيانات الحضور"),
});
