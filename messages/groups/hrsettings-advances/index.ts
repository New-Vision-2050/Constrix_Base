import { _m, MessagesGroup } from "../../types";

export const hrsettingsAdvancesMessages = new MessagesGroup({
  policies: new MessagesGroup({
    name: _m("Policy Name", "اسم النظام"),
    maxAmount: _m("Max Amount", "أقصى قيمة للسلفة"),
    maxInstallments: _m("Repayment Period (months)", "مدة السداد (شهر)"),
    maxActiveAdvances: _m("Max Active Advances", "أقصى عدد للسلف النشطة"),
    requiresAttachment: _m("Requires Attachment", "يتطلب مرفق"),
    required: _m("Required", "مطلوب"),
    notRequired: _m("Not Required", "غير مطلوب"),
    createdAt: _m("Created At", "تاريخ الإنشاء"),
    addAdvancePolicy: _m("Add New Advance Policy", "اضافة نظام سلفة جديد"),
    DeleteConfirmMessage: _m(
      "Are you sure you want to delete this policy? Its assignments to users will also be removed.",
      "هل أنت متأكد من حذف هذا النظام؟ سيتم أيضًا إلغاء تعيينه من الموظفين.",
    ),
    form: new MessagesGroup({
      title: _m("Add New Advance Policy", "اضافة نظام سلفة جديد"),
      basicData: _m("Basic Data", "البيانات الاساسية"),
      entitlement: _m("Entitlement", "الاستحقاق"),
      repayment: _m("Repayment", "السداد"),
      termination: _m("On Contract Termination", "في حالة انهاء التعاقد"),
      selectPlaceholder: _m("Select", "اختر"),
      numberRequired: _m("Please enter a valid number", "يرجى إدخال رقم صحيح"),

      name: _m("Policy Name", "اسم النظام"),
      namePlaceholder: _m("e.g. New car advance", "مثال: سلفة سيارة جديدة"),
      nameRequired: _m("Policy name is required", "اسم النظام مطلوب"),
      nameMaxLength: _m("Name must not exceed 255 characters", "الاسم يجب ألا يتجاوز 255 حرفًا"),
      maxAmount: _m("Max advance value from salary", "اقصى قيمة السلفة من المرتب"),
      maxAmountRequired: _m("Max value is required", "اقصى قيمة السلفة مطلوبة"),
      maxAmountRange: _m(
        "Value must be between 0.01 and 9999999999.99",
        "القيمة يجب أن تكون بين 0.01 و 9999999999.99",
      ),
      minAmount: _m("Min advance value from salary", "اقل قيمة السلفة من المرتب"),
      minAmountRequired: _m("Min value is required", "اقل قيمة السلفة مطلوبة"),
      minAmountGreaterThanMax: _m(
        "Min value must not exceed the max value",
        "اقل قيمة يجب ألا تتجاوز اقصى قيمة",
      ),

      entitlementStart: _m("Entitlement starts from", "يبدأ الاستحقاق من"),
      fromHireDate: _m("From hire date", "من تاريخ التعيين"),
      afterDurationFromHire: _m(
        "After a certain period from hiring",
        "بعد مدة معينة من التعيين",
      ),
      entitlementMonths: _m("Duration (months)", "المدة (شهر)"),
      entitlementMonthsRequired: _m("Duration is required", "المدة مطلوبة"),

      isRepayable: _m("Is the advance repaid?", "يتم سداد السلفة ؟"),
      repaymentSystem: _m("Repayment system", "نظام السداد"),
      installments: _m("Installments", "اقساط"),
      totalAmount: _m("Total amount", "اجمالي المبلغ"),
      repaymentMonths: _m("Repayment period (months)", "مدة السداد (شهر)"),
      repaymentMonthsRequired: _m("Repayment period is required", "مدة السداد مطلوبة"),
      repaymentMonthsRange: _m(
        "Must be a whole number between 1 and 120",
        "يجب أن تكون رقمًا صحيحًا بين 1 و 120",
      ),
      repaymentMethod: _m("Repayment method", "طريقة السداد"),
      salaryDeduction: _m("Direct salary deduction", "خصم مباشر من الراتب"),
      manualPayment: _m("Manual payment", "سداد يدوي"),

      terminationAction: _m("Action taken on the advance", "الاجراء المتخذ في السلفة"),
      deductFromDues: _m(
        "Deduct the amount from employee dues",
        "خصم المبلغ من مستحقات الموظف",
      ),
      collectCash: _m("Collect the amount in cash", "تحصيل المبلغ نقدًا"),

      submitButtonText: _m("Save", "حفظ"),
    }),
  }),
});
