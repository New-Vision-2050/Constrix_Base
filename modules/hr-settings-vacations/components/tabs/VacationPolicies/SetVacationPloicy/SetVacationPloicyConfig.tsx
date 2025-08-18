import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
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
    formId: "create-determinant-form",
    title,
    apiUrl: `${baseURL}/leave-policy-create-url`,
    initialValues: {},
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
            type: "select",
            name: "constraint_type",
            label: getText("form.type", "نوع الإجازة"),
            placeholder: getText("form.typePlaceholder", "نوع الإجازة"),
            defaultValue: "yearly",
            disabled: true,
            dynamicOptions: {
              url: `${baseURL}/vacation-policy-types-url`,
              valueField: "code",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            required: true,
            validation: [
              {
                type: "required",
                message: getText("form.typeRequired", "نوع الإجازة مطلوب"),
              },
            ],
          },
          // day type
          {
            type: "select",
            isMulti: true,
            name: "day_type",
            label: getText("form.dayType", "نوع الأيام"),
            placeholder: getText("form.dayTypePlaceholder", "نوع الأيام"),
            dynamicOptions: {
              url: `${baseURL}/vacation-policy-day-types-url`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
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
        ],
      },
    ],
    onSuccess: () => {
      onSuccessFn();
    },
    resetOnSuccess: true,
    onSubmit: async (formData: Record<string, unknown>) => {
      return {
        success: true,
        message: "تم حفظ المحدد بنجاح",
      };
    },
    submitButtonText: getText("form.submitButtonText", "حفظ المحدد"),
    cancelButtonText: getText("form.cancelButtonText", "إلغاء"),
  };
};
