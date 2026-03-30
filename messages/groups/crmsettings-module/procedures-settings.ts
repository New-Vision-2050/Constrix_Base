import { _m, MessagesGroup } from "../../types";

export const proceduresSettingsMessages = new MessagesGroup({
  title: _m("Procedures Settings", "اعداد إجراءات الطلبات"),
  subTabs: new MessagesGroup({
    clientRequests: _m("Client Requests", "طلبات العملاء"),
    contracts: _m("Contracts", "العقود"),
    priceOffers: _m("Price Offers", "عرض السعر"),
  }),
  stages: new MessagesGroup({
    title: _m("Stages", "المراحل"),
    addStage: _m("Add Stage", "اضافة مرحلة"),
    editStage: _m("Edit Stage", "تعديل اسم الاجراء"),
    stageName: _m("Stage Name", "اسم الاجراء"),
    enterStageName: _m("Enter stage name", "ادخل اسم الاجراء"),
    save: _m("Save", "حفظ"),
    delete: _m("Delete", "حذف"),
    cancel: _m("Cancel", "إلغاء"),
    edit: _m("Edit", "تعديل"),
    executeProjectStages: _m("Execute project stages", "تنفيذ مراحل المشروع"),
    sequential: _m("Sequential", "التوالي"),
    parallel: _m("Parallel", "التوازي"),
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
    title: _m("Procedures", "الإجراءات"),
    employee: _m("Employee", "الموظف"),
    approval: _m("Approval", "موافقة"),
    accreditation: _m("Accreditation", "الاعتماد"),
    exceedDuration: _m("Exceed Duration", "مدة التجاوز"),
    hour: _m("Hour", "ساعة"),
    template: _m("Template", "النموذج"),
    financialTemplate: _m("Financial Template", "نموذج مالي"),
    relevantDepartment: _m("Relevant Department", "الادارة المعنية"),
    humanResources: _m("Human Resources", "الموارد البشرية"),
    departmentManager: _m("Department Manager", "مدير القسم الوظيفي"),
    selectDepartmentName: _m("Select department name", "اختار اسم القسم"),
    addProcedureName: _m("Add procedure name", "اضافة اسم الاجراء"),
    accreditationType: new MessagesGroup({
      approval: _m("Approval", "موافقة"),
      financial: _m("Financial", "مالي"),
      accreditation: _m("Accreditation", "اعتماد"),
    }),
  }),
  steps: new MessagesGroup({
    stepName: _m("Step Name", "اسم المرحلة"),
    enterStepName: _m("Enter step name", "ادخل اسم المرحلة"),
    selectEmployee: _m("Select employee", "اختر اسم الموظف"),
    noProcedures: _m(
      "No procedures yet. Add a procedure to get started.",
      "لا توجد إجراءات. أضف إجراءاً للبدء.",
    ),
  }),
  actions: new MessagesGroup({
    add: _m("Add", "إضافة"),
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
});
