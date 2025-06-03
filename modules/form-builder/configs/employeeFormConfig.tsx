import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { RetrieveEmployeeFormConfig } from "@/modules/program-settings/users-settings/config/RetrieveEmployeeFormConfig";
import RetrieveEmployeeData from "@/modules/program-settings/components/retrieve-employee-data";

export function employeeFormConfig(
  t: ReturnType<typeof useTranslations>,
  handleCloseForm?: () => void
): FormConfig {
  const formId = "employee-form";
  return {
    formId,
    title: "اضافة",
    apiUrl: `${baseURL}/company-users/employees`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        collapsible: false,
        fields: [
          {
            name: "roles",
            label: "roles",
            type: "hiddenObject",
          },
          {
            name: "payload",
            label: "payload",
            type: "hiddenObject",
          },
          {
            name: "employee_in_another_company",
            label: "employee_in_another_company",
            type: "hiddenObject",
          },
          {
            name: "employee_in_company",
            label: "employee_in_company",
            type: "hiddenObject",
          },
          {
            name: "user_id",
            label: "user_id",
            type: "hiddenObject",
          },
          {
            name: "first_name",
            label: "اسم الموظف الاول",
            type: "text",
            placeholder: "ادخل اسم الموظف الاول",
            required: true,
            validation: [
              {
                type: "required",
                message: "اسم الموظف الاول مطلوب",
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicFirstName"),
              },
              {
                type: "minLength",
                value: 2,
                message: "الاسم يجب أن يحتوي على حرفين على الأقل.",
              },
            ],
          },
          {
            name: "last_name",
            label: "اسم الموظف الأخير",
            type: "text",
            placeholder: "اسم الموظف الأخير",
            required: true,
            validation: [
              {
                type: "required",
                message: "الاسم مطلوب",
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicLastName"),
              },
              {
                type: "minLength",
                value: 2,
                message: "الاسم يجب أن يحتوي على حرفين على الأقل.",
              },
            ],
          },
          {
            name: "country_id",
            label: "الجنسية",
            type: "select",
            placeholder: "اختر الجنسية",
            dynamicOptions: {
              url: `${baseURL}/countries`,
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
                message: "الجنسية مطلوب",
              },
            ],
          },
          {
            name: "email",
            label: "البريد الإلكتروني",
            type: "email",
            placeholder: "ادخل البريد الإلكتروني",
            required: true,
            validation: [
              {
                type: "required",
                message: "البريد الإلكتروني مطلوب",
              },
              {
                type: "email",
                message: "يرجى إدخال عنوان بريد إلكتروني صالح.",
              },
              {
                type: "apiValidation",
                message: (
                  <RetrieveEmployeeData
                    formId={formId}
                    handleCloseForm={handleCloseForm}
                    dialogStatement="البريد الإلكتروني أدناه مضاف مسبقًا"
                    formConfig={(
                      userId: string,
                      branchesIds?: string[],
                      roleTwoIds?: string[], //client
                      roleThreeIds?: string[], //broker
                      handleOnSuccess?: () => void
                    ) =>
                      RetrieveEmployeeFormConfig(
                        userId,
                        branchesIds,
                        roleTwoIds,
                        roleThreeIds,
                        handleOnSuccess
                      )
                    }
                  />
                  // <EmployeeInvalidMailDialog
                  //   formId={formId}
                  //   dialogStatement="البريد الإلكتروني أدناه مضاف مسبقًا"
                  //   onSuccess={() => {
                  //     handleCloseForm?.();
                  //   }}
                  //   formConfig={(
                  //     userId: string,
                  //     branchesIds?: string[],
                  //     roleTwoIds?: string[],//client
                  //     roleThreeIds?: string[],//broker
                  //     handleOnSuccess?: () => void
                  //   ) =>
                  //     RetrieveEmployeeFormConfig(
                  //       userId,
                  //       branchesIds,
                  //       roleTwoIds,
                  //       roleThreeIds,
                  //       handleOnSuccess
                  //     )
                  //   }
                  // />
                ),
                apiConfig: {
                  url: `${baseURL}/company-users/check-email`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  successCondition: (response) => {
                    const userId = response.payload?.[0]?.id || "";
                    const roles = response.payload?.[0]?.roles || [];
                    // Update the roles in the form store
                    if (roles.length > 0) {
                      useFormStore.getState().setValues(formId, {
                        roles: JSON.stringify(roles),
                      });
                    }
                    // store the user ID in the form store
                    if (userId) {
                      useFormStore.getState().setValues(formId, {
                        user_id: userId,
                      });
                    }

                    // store payload
                    if (response.payload) {
                      useFormStore.getState().setValues(formId, {
                        payload: JSON.stringify(response.payload?.[0]),
                      });
                    }
                    // status = 0 --> mean exist in another company
                    useFormStore.getState().setValues(formId, {
                      employee_in_another_company:
                        response.payload?.[0]?.status,
                    });

                    useFormStore.getState().setValues(formId, {
                      employee_in_company:
                        response.payload?.[0]?.status_in_company,
                    });

                    return response.payload?.[0]?.status === 1;
                  },
                },
              },
            ],
          },
          {
            name: "phone",
            label: "الهاتف",
            type: "phone",
            placeholder: "يرجى إدخال رقم هاتفك.",
            required: true,
            validation: [
              { type: "required", message: "رقم الهاتف مطلوب" },
              { type: "phone", message: "رقم الهاتف غير صحيح" },
            ],
          },
          {
            type: "select",
            name: "job_title_id",
            label: "المسمى الوظيفي",
            placeholder: "اختر المسمى الوظيفي",
            dynamicOptions: {
              url: `${baseURL}/job_titles/list`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              filterParam: "id",
            },
          },
          {
            name: "branch_id",
            label: "الفرع",
            type: "select",
            placeholder: "اختر الفرع",
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=branch`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
          },
          {
            name: "status",
            label: "حالة الموظف",
            type: "select",
            placeholder: "اختر حالة الموظف",
            options: [
              { label: "نشط", value: "1" },
              { label: "غير نشط", value: "0" },
            ],
          },
        ],
      },
    ],
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
