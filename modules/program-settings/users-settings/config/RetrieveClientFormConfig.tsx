import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { UsersTypes } from "../../constants/users-types";

export const RetrieveClientFormConfig = (
  userId: string,
  branchesIds?: string[],
  roleTwoIds?: string[], //employee
  roleThreeIds?: string[], //broker
  handleOnSuccess?: () => void
) => {
  const formId = `RetrieveClientFormConfig-programSettings`;

  const CreateUserFormConfig: FormConfig = {
    formId,
    apiUrl: `${baseURL}/company-users/${userId}/assign-role-for-current-company`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    editApiMethod: "POST",
    sections: [
      {
        fields: [
          {
            name: "role",
            label: "role",
            defaultValue: UsersTypes.Client,
            type: "hiddenObject",
          },
          {
            name: "roleTwoIds",
            label: "موظف لدى",
            type: "select",
            isMulti: true,
            disabled: true,
            placeholder: "اختر الفروع",
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
            condition: () => Boolean(roleTwoIds && roleTwoIds?.length > 0),
          },
          {
            name: "roleThreeIds",
            label: "وسيط لدي",
            type: "select",
            isMulti: true,
            disabled: true,
            placeholder: "اختر الفروع",
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
            condition: () => Boolean(roleThreeIds && roleThreeIds?.length > 0),
          },
          {
            name: "branch_ids",
            label: "عميل لدي",
            type: "select",
            isMulti: true,
            placeholder: "اختر الفروع",
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=branch`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              filterParam: "id",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
          },
        ],
      },
    ],
    initialValues: {
      roleTwoIds,
      roleThreeIds,
      branch_ids: branchesIds,
    },
    onSuccess: () => {
      if (handleOnSuccess) {
        handleOnSuccess();
      }
    },
    isEditMode: true,
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
  return CreateUserFormConfig;
};
