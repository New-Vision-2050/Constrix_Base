import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useManagementsStructureCxt } from "./context";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useOrgStructureCxt } from "@/modules/organizational-structure/context/OrgStructureCxt";

export function GetOrgStructureManagementFormConfig(): FormConfig {
  const { companyOwnerId, user } = useOrgStructureCxt();
  const { activeBranch } = useManagementsStructureCxt();
  console.log("companyOwnerId", companyOwnerId, user);

  const _config: FormConfig = {
    formId: "org-structure-management-form",
    title: "اضافة ادارة",
    apiUrl: `${baseURL}/management_hierarchies/create-management`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "اضافة ادارة",
        fields: [
          {
            name: "branch_id",
            label: "الادارة التابعة الى",
            type: "select",
            placeholder: "الادارة التابعة الى",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "الادارة مطلوب",
              },
            ],
          },
          {
            name: "name",
            label: "اسم الادارة",
            type: "text",
            placeholder: "برجاء إدخال اسم الادارة",
            required: true,
            validation: [
              {
                type: "required",
                message: `اسم الادارة مطلوب`,
              },
            ],
          },
          {
            name: "description",
            label: "وصف الادارة",
            type: "text",
            placeholder: "برجاء إدخال وصف الادارة",
            required: true,
            validation: [
              {
                type: "required",
                message: `وصف الادارة مطلوب`,
              },
            ],
          },
          {
            name: "reference_user_id",
            label: "الشخص المرجعي",
            type: "select",
            placeholder: "الشخص المرجعي",
            // required: true,
            disabled: user?.id !== companyOwnerId,
            dynamicOptions: {
              url: `${baseURL}/users/admin-users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            // validation: [
            //   {
            //     type: "required",
            //     message: "الشخص المرجعي مطلوب",
            //   },
            // ],
          },
          {
            name: "manager_id",
            label: "اسم المدير",
            type: "select",
            placeholder: "اسم المدير",
            // required: true,
            disabled: user?.id !== companyOwnerId,
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/user-lower-levels`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
              dependsOn: "reference_user_id",
              filterParam: "user_id",
            },
            // validation: [
            //   {
            //     type: "required",
            //     message: "اسم المدير مطلوب",
            //   },
            // ],
          },
          {
            name: "deputy_manager_ids",
            label: "نائب المدير",
            type: "select",
            placeholder: "نائب المدير",
            // required: true,
            isMulti: true,
            disabled: user?.id !== companyOwnerId,
            dynamicOptions: {
              url: `${baseURL}/users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            // validation: [
            //   {
            //     type: "required",
            //     message: "نائب المدير مطلوب",
            //   },
            // ],
          },
          {
            name: "is_active",
            label: "الحالة",
            type: "select",
            placeholder: "الحالة",
            required: true,
            options: [
              { value: "1", label: "نشط" },
              { value: "0", label: "غير نشط" },
            ],
            validation: [
              {
                type: "required",
                message: "الحالة مطلوب",
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      manager_id: user?.id !== companyOwnerId ? companyOwnerId : undefined,
      reference_user_id:
        user?.id !== companyOwnerId ? companyOwnerId : undefined,
      deputy_manager_ids: user?.id !== companyOwnerId ? [companyOwnerId] : [],
    },
    onSubmit: async (formData) => {
      const body = {
        ...formData,
      };
      console.log("activeBranch", activeBranch, "body", body);
      return await defaultSubmitHandler(body, _config, {
        url: `${baseURL}/management_hierarchies/create-management`,
      });
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };

  return _config;
}
