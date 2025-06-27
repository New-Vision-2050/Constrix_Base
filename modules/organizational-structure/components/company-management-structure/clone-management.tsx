import { baseURL } from "@/config/axios-config";
import { CompanyData } from "@/modules/company-profile/types/company";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { OrgChartNode } from "@/types/organization";

type PropsT = {
  isEdit?: boolean;
  branchId: string | number;
  isUserCompanyOwner: boolean;
  selectedNode: OrgChartNode | undefined;
  companyOwnerId: string | undefined;
  companyData?: CompanyData;
  onClose?: () => void;
};

export function CloneManagement(props: PropsT): FormConfig {
  console.log("CloneManagement props", props);

  const {
    isEdit = false,
    isUserCompanyOwner,
    companyOwnerId,
    selectedNode,
    branchId,
    onClose,
    companyData,
  } = props;

  const branches = companyData?.branches || [];
  const branchesOptions = branches.map((branch) => ({
    value: branch.id,
    label: branch.name,
  }));

  const _config: FormConfig = {
    formId: "clone-management-form",
    title: "نسخ ادارة",
    apiUrl: `${baseURL}/management_hierarchies/clone-department`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "target_branch_id",
            label: "اختر الفرع",
            type: "select",
            placeholder: "اختر الفرع",
            required: true,
            options: branchesOptions,
            validation: [
              {
                type: "required",
                message: "الفرع مطلوب",
              },
            ],
          },
          {
            name: "source_department_id",
            label: "الادارة التابعة الى",
            type: "select",
            placeholder: "الادارة التابعة الى",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=management&parent_children_id=${selectedNode?.branch_id}`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
              dependsOn: "target_branch_id",
              filterParam: "branch_id",
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
            name: "reference_user_id",
            label: "الشخص المرجعي",
            type: "select",
            placeholder: "الشخص المرجعي",
            disabled: isUserCompanyOwner,
            dynamicOptions: {
              url: `${baseURL}/users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
          },
          {
            name: "manager_id",
            label: "اسم المدير",
            type: "select",
            placeholder: "اسم المدير",
            disabled: isUserCompanyOwner,
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
          },
          {
            name: "deputy_manager_ids",
            label: "نائب المدير",
            type: "select",
            placeholder: "نائب المدير",
            isMulti: true,
            disabled: isUserCompanyOwner,
            dynamicOptions: {
              url: `${baseURL}/users`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
          },
          // {
          //   name: "is_active",
          //   label: "الحالة",
          //   type: "select",
          //   placeholder: "الحالة",
          //   required: true,
          //   options: [
          //     { value: "1", label: "نشط" },
          //     { value: "0", label: "غير نشط" },
          //   ],
          //   validation: [
          //     {
          //       type: "required",
          //       message: "الحالة مطلوب",
          //     },
          //   ],
          // },
        ],
      },
    ],
    initialValues: {
      target_branch_id: selectedNode?.branch_id,
      source_department_id: selectedNode?.id,
    },
    onSubmit: async (formData) => {
      const method = isEdit ? "PUT" : "POST";
      const reqBody = {
        source_department_id: formData.source_department_id,
        target_branch_id: formData.target_branch_id,
        clone_sub_departments: false,
        clone_managers: false,
        override_params: {
          name: formData.name,
          manager_id: formData.manager_id,
          is_active: false,
        },
      };

      return await defaultSubmitHandler(reqBody, _config, {
        method: method,
        url: `${baseURL}/management_hierarchies/clone-department`,
      });
    },
    onSuccess: () => {
      onClose?.();
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
  };
  return _config;
}
