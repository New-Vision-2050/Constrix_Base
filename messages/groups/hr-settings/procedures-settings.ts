import { _m, MessagesGroup } from "../../types";

export const hrProceduresSettingsMessages = new MessagesGroup({
  title: _m("Procedures and Settings", "الاجراءات والاعدادات"),
  subTabs: new MessagesGroup({
    workMissionStart: _m("Start of work mission", "بداية مهمة العمل"),
    employeeTaskRequests: _m("Employee Task Requests", "مهمات العمل"),
    workPlan: _m("Work plan", "خطة العمل"),
    useWorkPlanProcedures: _m(
      "Procedures will be taken from the work plan",
      "سيتم اخذ الاجراءات من خطة العمل",
    ),
  }),
  tabTitles: new MessagesGroup({
    employees: _m(
      "Work mission procedures settings",
      "اعداد إجراءات مهمة العمل",
    ),
    editEmployees: _m(
      "Edit work mission procedures",
      "تعديل إجراءات مهمة العمل",
    ),
    accreditation: _m(
      "Accreditation procedures settings",
      "اعداد أجراءات الاعتماد",
    ),
  }),
  common: new MessagesGroup({
    search: _m("Search...", "البحث..."),
    noResults: _m("No results", "لا توجد نتائج"),
    select: _m("Select", "اختر"),
    hours: _m("Hours", "ساعات"),
    hour: _m("Hour", "ساعة"),
    requiredField: _m("This field is required", "هذا الحقل مطلوب"),
    enterHoursOrDays: _m(
      "Enter hours or days",
      "يجب إدخال ساعات أو أيام",
    ),
    searchManagement: _m("Search for department...", "البحث عن اداره..."),
  }),
  stages: new MessagesGroup({
    addStage: _m("Add Stage", "اضافة مرحلة"),
    editStage: _m("Edit Stage", "تعديل اسم الاجراء"),
    stageName: _m("Stage Name", "اسم الاجراء"),
    enterStageName: _m("Enter stage name", "ادخل اسم الاجراء"),
    sequentialApproval: _m("Sequential approval", "الاعتماد التسلسلي"),
    parallelApproval: _m("Parallel approval", "الاعتماد المتوازي"),
    timeLimit: _m("Time limit", "المهلة الزمنية"),
    escalationEntity: _m("Escalation entity", "الجهة المصعد اليها"),
    selectEscalationEntity: _m(
      "Select escalation entity",
      "اختر الجهة المصعد إليها",
    ),
    selectIcon: _m("Select Icon", "اختيار ال Icon"),
    stageDurationPercentage: _m(
      "Stage duration percentage %",
      "نسبة مدة المراحل %",
    ),
    percentageMax: _m(
      "Percentage must not exceed 100.",
      "يجب ألا تتجاوز النسبة 100٪.",
    ),
  }),
  procedures: new MessagesGroup({
    addProcedureName: _m("Add procedure name", "اضافة اسم الاجراء"),
    accreditationType: new MessagesGroup({
      approval: _m("Approval", "موافقة"),
      financial: _m("Financial", "مالي"),
      accreditation: _m("Accreditation", "اعتماد"),
    }),
  }),
  steps: new MessagesGroup({
    addStage: _m("Add stage", "اضافة مرحلة"),
    stage: _m("Stage", "المرحلة"),
    enterStepName: _m("Enter step name", "ادخل اسم المرحلة"),
    selectEmployee: _m("Select employee", "اختر اسم الموظف"),
    noProcedures: _m(
      "No procedures yet. Add a procedure to get started.",
      "لا توجد إجراءات. أضف إجراءاً للبدء.",
    ),
  }),
  stepCard: new MessagesGroup({
    selectBranch: _m("Select branch", "اختر الفرع"),
    selectManagement: _m("Select management", "اختر الادارة"),
    actionTaker: _m("Action taker", "متخذي الاجراء"),
    concernedUsers: _m("Concerned users", "المعنيين بالاجراء"),
    selectEmployees: _m("Select employees", "اختار الموظفين"),
    selectReportTypes: _m("Select report types", "اختار أنواع التقارير"),
    timeLimit: _m("Time limit", "المهلة الزمنية"),
    escalationDuration: _m("Escalation duration", "مدة التصعيد"),
    validation: new MessagesGroup({
      selectEmployees: _m("Please select employees", "يرجى اختيار الموظفين"),
    }),
  }),
  actions: new MessagesGroup({
    add: _m("Add", "اضافة"),
    edit: _m("Edit", "تعديل"),
    delete: _m("Delete", "حذف"),
    save: _m("Save", "حفظ"),
    cancel: _m("Cancel", "إلغاء"),
  }),
  messages: new MessagesGroup({
    stageAdded: _m("Stage added successfully", "تمت إضافة المرحلة بنجاح"),
    stageUpdated: _m("Stage updated successfully", "تم تحديث المرحلة بنجاح"),
    stageDeleted: _m("Stage deleted successfully", "تم حذف المرحلة بنجاح"),
    procedureAdded: _m(
      "Procedure added successfully",
      "تمت إضافة الإجراء بنجاح",
    ),
    procedureUpdated: _m(
      "Procedure updated successfully",
      "تم تحديث الإجراء بنجاح",
    ),
    procedureDeleted: _m(
      "Procedure deleted successfully",
      "تم حذف الإجراء بنجاح",
    ),
    error: _m("Something went wrong", "حدث خطأ ما"),
  }),
  taskActionDialog: new MessagesGroup({
    title: _m("Action details", "تفاصيل الاجراء"),
    actionName: _m("Action name", "اسم الاجراء"),
    actionNamePlaceholder: _m(
      "Extend work task time",
      "تمديد وقت مهمة العمل",
    ),
    modelsLabel: _m("Models", "النماذج"),
    selectModels: _m("Select models", "اختيار النماذج"),
    formConditions: _m("Form conditions", "شروط النماذج"),
    actionOrder: _m("Action order", "ترتيب الاجراء"),
    appearsBeforeAfter: _m(
      "Appears before / after",
      "يظهر قبل يظهر بعد",
    ),
    selectAction: _m("Select action", "اختيار الاجراء"),
    save: _m("Save", "حفظ"),
    models: new MessagesGroup({
      taskTimeSetting: _m(
        "Work task time setting",
        "وقت تحديد مهمة العمل",
      ),
      cancelTask: _m("Cancel task", "الغاء المهمة"),
      confirmLocation: _m("Confirm location", "تأكيد الموقع"),
      confirmTaskLocation: _m(
        "Confirm task location",
        "تأكيد موقع المهمة",
      ),
      selectOtherEmployee: _m(
        "Select another employee",
        "تحديد موظف اخر",
      ),
      sendAndApprove: _m("Send and approve", "ارسال واعتماد"),
    }),
    conditions: new MessagesGroup({
      employeeOnDuty: _m("Employee on duty", "موظف داخل الدوام"),
      employeeOffDuty: _m("Employee off duty", "موظف خارج الدوام"),
      worksAllBranches: _m("Works in all branches", "تعمل في جميع الفروع"),
      taskDuration: _m("Task duration", "مدة المهمة"),
    }),
  }),
});
