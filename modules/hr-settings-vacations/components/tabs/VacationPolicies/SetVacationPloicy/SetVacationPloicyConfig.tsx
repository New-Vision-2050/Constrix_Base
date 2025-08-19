import { Label } from "@/components/ui/label";
import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { DaysTypes } from "@/modules/hr-settings-vacations/constants/days-types";
import { VacationPolicie } from "@/modules/hr-settings-vacations/types/VacationPolicie";

type PropsT = {
  onSuccessFn: () => void;
  t?: (key: string) => string;
  // Optional constraint for editing mode
  editedPolicy?: VacationPolicie;
};
// Function to get form config with dynamic day sections
export const getSetVacationPloicyConfig = (props: PropsT): FormConfig => {
  // Props
  const { onSuccessFn, t, editedPolicy } = props;

  // Function to get text with default value
  const getText = (key: string, defaultText: string) => {
    return t ? t(key) : defaultText;
  };

  const isEdit = Boolean(editedPolicy);
  const title = isEdit
    ? getText("form.editTitle", "تعديل نظام اجازة")
    : getText("form.title", "اضافة نظام اجازة جديد");

  // ------------- return form config -------------
  return {
    formId: "create-vacation-policy-form",
    title,
    apiUrl: `${baseURL}/leave-policies`,
    editApiUrl: `${baseURL}/leave-policies/${editedPolicy?.id}`,
    editApiMethod: "PUT",
    isEditMode: isEdit,
    initialValues: {
      name: editedPolicy?.name || "",
      total_days: editedPolicy?.total_days || "",
      day_type: editedPolicy?.day_type || "",
      is_rollover_allowed: editedPolicy?.is_rollover_allowed || true,
      is_allow_half_day: editedPolicy?.is_allow_half_day || false,
      upgrade_condition: editedPolicy?.upgrade_condition || "",
      vacation_type: getText("yearly", "سنوية"),
    },
    sections: [
      {
        fields: [
          // policy name
          {
            type: "text",
            name: "name",
            label: getText("form.name", "اسم النظام"),
            placeholder: getText("form.namePlaceholder", "اسم النظام"),
            required: true,
            validation: [
              {
                type: "required",
                message: getText("form.nameRequired", "اسم النظام مطلوب"),
              },
              {
                type: "pattern",
                value: /^[\p{L}\p{N}\s]+$/u,
                message: getText(
                  "form.namePattern",
                  "اسم النظام يجب أن يحتوي على حروف وأرقام فقط"
                ),
              },
            ],
          },
          // total days
          {
            type: "number",
            name: "total_days",
            label: getText("form.totalDays", "عدد أيام الإجازة"),
            placeholder: getText(
              "form.totalDaysPlaceholder",
              "عدد أيام الإجازة"
            ),
            required: true,
            validation: [
              {
                type: "required",
                message: getText(
                  "form.totalDaysRequired",
                  "عدد أيام الإجازة مطلوب"
                ),
              },
              {
                type: "pattern",
                value: /^\d+$/,
                message: getText(
                  "form.totalDaysPattern",
                  "عدد أيام الإجازة يجب أن يكون رقمًا"
                ),
              },
            ],
          },
          // vacation type
          {
            type: "text",
            name: "vacation_type",
            label: getText("form.type", "نوع الإجازة"),
            placeholder: getText("form.typePlaceholder", "نوع الإجازة"),
            defaultValue: getText("yearly", "سنوية"),
            disabled: true,
            required: true,
            render: () => {
              return (
                <div className="w-full">
                  <Label htmlFor="vacation-type">
                    {getText("form.type", "نوع الإجازة")}
                  </Label>

                  <input
                    type="text"
                    value={getText("yearly", "سنوية")}
                    disabled
                    className="w-full rounded-lg bg-[#140f34] dark:bg-[#1A103C] border border-gray-300 dark:border-gray-700 py-2 px-3 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    readOnly
                  />
                </div>
              );
            },
          },
          // day type
          {
            type: "select",
            name: "day_type",
            label: getText("form.dayType", "نوع الأيام"),
            placeholder: getText("form.dayTypePlaceholder", "نوع الأيام"),
            options: [
              {
                value: DaysTypes.calender,
                label: getText("calender", "التقويم"),
              },
              {
                value: DaysTypes.work_day,
                label: getText("work_day", "يوم عمل"),
              },
            ],
            required: true,
            validation: [
              {
                type: "required",
                message: getText(
                  "form.dayTypeRequired",
                  "يجب اختيار نوع يوم واحد على الأقل"
                ),
              },
            ],
          },
          // vacation rollover?
          {
            type: "checkbox",
            name: "is_rollover_allowed",
            label: getText("form.isRolloverAllowed", "هل يسمح بترحيل الاجازة؟"),
            defaultValue: true,
            required: true,
          },
          // half day allowed?
          {
            type: "checkbox",
            name: "is_allow_half_day",
            label: getText("form.isAllowHalfDay", "هل يسمح بالنصف يوم؟"),
            defaultValue: false,
            required: true,
          },
          // upgrade_condition
          {
            type: "text",
            name: "upgrade_condition",
            label: getText("form.upgradeCondition", "شرط الترقية"),
            placeholder: getText(
              "form.upgradeConditionPlaceholder",
              "شرط الترقية"
            ),
            required: false,
          },
        ],
      },
    ],
    onSuccess: () => {
      onSuccessFn();
    },
    resetOnSuccess: true,
    submitButtonText: getText("form.submitButtonText", "حفظ المحدد"),
    cancelButtonText: getText("form.cancelButtonText", "إلغاء"),
  };
};
