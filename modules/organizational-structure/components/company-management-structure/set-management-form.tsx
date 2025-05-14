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
};

export function GetOrgStructureManagementFormConfig(props: PropsT): FormConfig {
  const {
    isEdit = false,
    isUserCompanyOwner,
    companyOwnerId,
    selectedNode,
    branchId,
    onClose,
  } = props;

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
            label: "branch_id",
            type: "hiddenObject",
          },
          {
            name: "management_id",
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
      branch_id: selectedNode?.branch_id,
      name: isEdit ? selectedNode?.name : undefined,
      description: isEdit ? selectedNode?.description : undefined,
      is_active: isEdit ? selectedNode?.status == 1 : undefined,
      management_id: isEdit ? selectedNode?.parent_id : selectedNode?.id,
      manager_id: isUserCompanyOwner
        ? companyOwnerId
        : !isEdit
        ? undefined
        : selectedNode?.manager_id,
      reference_user_id: isUserCompanyOwner
        ? companyOwnerId
        : !isEdit
        ? undefined
        : selectedNode?.reference_user_id,
      deputy_manager_ids: isUserCompanyOwner
        ? [companyOwnerId]
        : !isEdit
        ? []
        : selectedNode?.deputy_managers?.map((ele) => ele.id),
    },
    onSubmit: async (formData) => {
      const method = isEdit ? "PUT" : "POST";
      const body = {
        ...formData,
        branch_id: branchId || selectedNode?.branch_id,
      };

      return await defaultSubmitHandler(body, _config, {
        method: method,
        url: `${baseURL}/management_hierarchies/${
          isEdit ? `update-management/${selectedNode?.id}` : "create-management"
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
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
  };

  return _config;
}
