import { _m, MessagesGroup } from "../../types";

export const activitiesLogsMessages = new MessagesGroup({
  search: new MessagesGroup({
    title: _m("Search Filter", "بحث"),
    type: _m("Operation Type", "نوع العملية"),
    user: _m("User", "المستخدم"),
    timeFrom: _m("Date From", "من التاريخ"),
    timeTo: _m("Date To", "الى التاريخ"),
    reset: _m("Reset", "إعادة تعيين")
  }),
  logs: new MessagesGroup({
    title: _m("User Activity Timeline", "سجل الانشطة"),
    createdOperation: _m("Operation created", "عملية انشاء"),
    updatedOperation: _m("Operation updated", "عملية تعديل"),
    deletedOperation: _m("Operation deleted", "عملية حذف"),
    noActivities: _m("No activities found", "لا توجد أنشطة"),
    noActivitiesDesc: _m("No activities found for the selected date range. Try changing the search criteria.", "لم يتم العثور على أي أنشطة في الفترة المحددة. جرب تغيير معايير البحث.")
  })
});
