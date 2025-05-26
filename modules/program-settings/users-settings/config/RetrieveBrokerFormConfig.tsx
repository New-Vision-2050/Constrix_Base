import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { UsersTypes } from "../../constants/users-types";

// Create a stable empty array to prevent infinite loops
const EMPTY_BRANCHES: string[] = [];

export const RetrieveBrokerFormConfig = (
  userId: string,
  branchesIds?: string[]
) => {
  console.log(
    "BranchesIds? ",
    branchesIds && branchesIds.length > 0,
    branchesIds
  );
  const formId = `RetrieveBrokerFormConfig-programSettings`;

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
            defaultValue: UsersTypes.Broker,
            type: "hiddenObject",
          },
          {
            name: "branch_ids",
            label: "الفروع",
            type: "select",
            isMulti: true,
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
          },
        ],
      },
    ],
    initialValues: {
      branch_ids: [6],
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
