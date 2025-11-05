import { baseURL } from "@/config/axios-config";
import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { OrgChartNode } from "@/types/organization";

type PropsT = {
  isEdit?: boolean;
  branchId: string | number;
  isUserCompanyOwner: boolean;
  selectedNode: OrgChartNode | undefined;
  companyOwnerId: string | undefined;
  onClose?: () => void;
  mainBranch?: { id: string; name: string };
};

export function GetOrgStructureManagementFormConfig(props: PropsT): FormConfig {
  const {
    isEdit = false,
    isUserCompanyOwner,
    companyOwnerId,
    selectedNode,
    branchId,
    onClose,
    mainBranch,
  } = props;

  const _config: FormConfig = {
    formId: "org-structure-management-form",
    title: "KKKاضافة ادارة",
    apiUrl: `${baseURL}/management_hierarchies/create-management`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "target_parent_id",
            label: "الادارة تابعة إلى",
            type: "select",
            placeholder: "الادارة تابعة إلى",
            required: true,
            // disabled: true,
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=management&parent_children_id=${selectedNode?.branch_id}`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "الادارة تابعة إلى مطلوب",
              },
            ],
          },
          {
            name: "source_department_id",
            label: "الادارة التي سيتم تعيينها",
            type: "select",
            required: true,
            placeholder: "الادارة التي سيتم تعيينها",
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/non-copied?ignore_branch_id=${branchId}`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              disableReactQuery: true,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "الادارة التي سيتم نسخها مطلوب",
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
      target_parent_id: selectedNode?.id?.toString(),
    },
    onSubmit: async (formData) => {
      const method = "POST";
      const reqBody = {
        source_department_id: formData.source_department_id,
        target_parent_id: formData.target_parent_id,
        clone_sub_departments: false,
        clone_managers: false,
      };

      return await defaultSubmitHandler(reqBody, _config, {
        method: method,
        url: `${baseURL}/management_hierarchies/${
          isEdit ? "clone-department/" + selectedNode?.id : "clone-department"
        }`,
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
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
  return _config;
}
