import { _m, MessagesGroup } from "../../types";

export const hrsettingsVacationsMessages = new MessagesGroup({
  tabs: new MessagesGroup({
    leavesPolicies: _m("Leaves Policies", "أنظمة الاجازات"),
    leavesTypes: _m("Leaves Types", "أنواع الاجازات"),
    publicLeaves: _m("Public Leaves", "الاجازات الرسمية")
  }),
  leavesPolicies: new MessagesGroup({
    title: _m("Leave Policies", "أنظمة الاجازات"),
    IsTheLeaveCarriedOver: _m("Is the leave carried over?", "هل يتم ترحيل الاجازة؟"),
    leaveCarriedOver: _m("Carried over", "يتم ترحيل الاجازة"),
    leaveNotCarriedOver: _m("Not carried over", "لا يتم ترحيل الاجازة"),
    halfDay: _m("Half day", "نص يوم"),
    totalDays: _m("Total days", "عدد أيام الإجازة"),
    dayType: _m("Day type", "نوع  أيام الإجازة"),
    isAllowHalfDay: _m("Is allow half day", "هل يسمح بالنصف يوم"),
    allowed: _m("Allowed", "مسموح"),
    notAllowed: _m("Not allowed", "غير مسموح"),
    noUpgradeCondition: _m("No upgrade condition", "لا يوجد شرط ترقية"),
    addNewPolicy: _m("Add New Policy", "إنشاء نظام اجازة جديد"),
    allBranches: _m("All Branches", "جميع الفروع"),
    yearly: _m("Yearly", "سنوية"),
    calender: _m("Calendar", "تقويم"),
    work_day: _m("Work day", "يوم عمل"),
    loading: new MessagesGroup({
      title: _m("Loading vacation policies", "جاري تحميل أنظمة الإجازة"),
      description: _m("Please wait while we fetch the vacation policies data...", "يرجى الانتظار بينما نقوم بتحميل بيانات أنظمة الإجازة...")
    }),
    noData: new MessagesGroup({
      title: _m("No vacation policies found", "لا توجد أنظمة إجازة"),
      description: _m("There are no vacation policies available at the moment.", "لا توجد أي أنظمة إجازة حاليا.")
    }),
    form: new MessagesGroup({
      title: _m("Add New Leave Policy", "اضافة نظام اجازة جديد"),
      editTitle: _m("Edit Leave Policy", "تعديل نظام اجازة"),
      name: _m("Name", "اسم نظام الاجازة"),
      namePlaceholder: _m("Name", "اسم نظام الاجازة"),
      nameRequired: _m("Name is required", "اسم نظام الاجازة مطلوب"),
      namePattern: _m("Name must contain only letters and numbers", "اسم نظام الاجازة يجب أن يحتوي على حروف وأرقام فقط"),
      totalDays: _m("Total days", "عدد أيام الإجازة"),
      totalDaysPlaceholder: _m("Total days", "عدد أيام الإجازة"),
      totalDaysRequired: _m("Total days is required", "عدد أيام الإجازة مطلوب"),
      totalDaysPattern: _m("Total days must be a number", "عدد أيام الإجازة يجب أن يكون رقمًا"),
      type: _m("Type", "نوع الإجازة"),
      typePlaceholder: _m("Type", "نوع الإجازة"),
      typeRequired: _m("Type is required", "نوع الإجازة مطلوب"),
      dayType: _m("Day type", "نوع الأيام"),
      dayTypePlaceholder: _m("Day type", "نوع الأيام"),
      dayTypeRequired: _m("Day type is required", "نوع الأيام مطلوب"),
      isRolloverAllowed: _m("Is rollover allowed?", "هل يسمح بترحيل الاجازة؟"),
      isAllowHalfDay: _m("Is allow half day?", "هل يسمح بالنصف يوم؟"),
      upgradeCondition: _m("Upgrade condition", "شرط الترقية"),
      upgradeConditionPlaceholder: _m("Upgrade condition", "شرط الترقية"),
      submitButtonText: _m("Save", "حفظ"),
      cancelButtonText: _m("Cancel", "إلغاء")
    })
  }),
  leavesTypes: new MessagesGroup({
    title: _m("Set Vacation Type", "أنواع الاجازات"),
    table: new MessagesGroup({
      name: _m("Name", "اسم الاجازة"),
      isPaid: _m("Paid", "الاجازة مدفوعة"),
      paid: _m("Paid", "مدفوع"),
      notPaid: _m("Not Paid", "غير مدفوع"),
      isDuduct_from_balance: _m("Deduct from balance", "خصم من الرصيد"),
      duduct: _m("Deduct", "خصم"),
      notDuduct: _m("Not Deduct", "من دون خصم"),
      conditions: _m("Conditions", "الشروط"),
      branches: _m("Branches", "الفروع"),
      branchesFilter: _m("Branches", "الفروع"),
      countryFilter: _m("Country", "الدولة"),
      isPaidFilter: _m("Paid?", "الاجازة مدفوعة؟"),
      isDuductFilter: _m("Deduct from balance?", "خصم من الرصيد؟"),
      DeleteConfirmMessage: _m("Are you sure you want to delete this type?", "هل أنت متأكد من حذف هذا النوع؟"),
      addVacationType: _m("Add New Vacation Type", "اضافة نوع اجازة جديد"),
      form: new MessagesGroup({
        title: _m("Add New Vacation Type", "اضافة نوع اجازة جديد"),
        name: _m("Name", "اسم نوع الاجازة"),
        namePlaceholder: _m("Name", "اسم نوع الاجازة"),
        nameRequired: _m("Name is required", "اسم نوع الاجازة مطلوب"),
        namePattern: _m("Name must contain only letters and numbers", "اسم نوع الاجازة يجب أن يحتوي على حروف وأرقام فقط"),
        isPaid: _m("Paid", "الاجازة مدفوعة"),
        isPaidPlaceholder: _m("Paid", "الاجازة مدفوعة"),
        isPaidRequired: _m("Paid", "الاجازة مدفوعة"),
        isDuduct: _m("Deduct from balance", "خصم من الرصيد"),
        isDuductPlaceholder: _m("Deduct from balance", "خصم من الرصيد"),
        isDuductRequired: _m("Deduct from balance", "خصم من الرصيد"),
        conditions: _m("Conditions", "الشروط"),
        conditionsPlaceholder: _m("Conditions", "الشروط"),
        conditionsRequired: _m("Conditions", "الشروط"),
        branches: _m("Branches", "الفروع"),
        branchesPlaceholder: _m("Branches", "اختر الفروع"),
        submitButtonText: _m("Save", "حفظ"),
        cancelButtonText: _m("Cancel", "إلغاء"),
        resetButtonText: _m("Clear", "مسح النموذج")
      })
    })
  }),
  publicLeaves: new MessagesGroup({
    title: _m("Public Leaves", "الاجازات العامة"),
    table: new MessagesGroup({
      name: _m("Name", "اسم الاجازة"),
      country: _m("Country", "الدولة"),
      startDate: _m("Start Date", "تاريخ البداية"),
      endDate: _m("End Date", "تاريخ النهاية"),
      countryFilter: _m("Country", "الدولة"),
      startDateFilter: _m("Start Date", "تاريخ البداية"),
      endDateFilter: _m("End Date", "تاريخ النهاية"),
      submitButtonText: _m("Save", "حفظ"),
      cancelButtonText: _m("Cancel", "إلغاء"),
      DeleteConfirmMessage: _m("Are you sure you want to delete this leave?", "هل أنت متأكد من حذف هذه الاجازة؟"),
      addPublicVacation: _m("Add Public Vacation", "اضافة اجازة رسمية"),
      form: new MessagesGroup({
        title: _m("Add New Public Vacation", "اضافة اجازة رسمية جديدة"),
        editTitle: _m("Edit Public Vacation", "تعديل اجازة رسمية"),
        name: _m("Name", "اسم اجازة"),
        namePlaceholder: _m("Name", "اسم اجازة"),
        nameRequired: _m("Name is required", "اسم اجازة مطلوب"),
        country: _m("Country", "الدولة"),
        countryPlaceholder: _m("Country", "الدولة"),
        countryRequired: _m("Country is required", "الدولة مطلوبة"),
        startDate: _m("Start Date", "تاريخ البداية"),
        startDatePlaceholder: _m("Start Date", "تاريخ البداية"),
        startDateRequired: _m("Start Date is required", "تاريخ البداية مطلوب"),
        endDate: _m("End Date", "تاريخ النهاية"),
        endDatePlaceholder: _m("End Date", "تاريخ النهاية"),
        endDateRequired: _m("End Date is required", "تاريخ النهاية مطلوب"),
        submitButtonText: _m("Save", "حفظ"),
        cancelButtonText: _m("Cancel", "إلغاء"),
        resetButtonText: _m("Clear", "مسح النموذج")
      })
    })
  })
});
