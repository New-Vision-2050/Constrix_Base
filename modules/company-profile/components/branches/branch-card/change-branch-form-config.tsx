import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Branch } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "next/navigation";

export const changeBranchForm = (branchId: string, branches: Branch[]) => {
  const { company_id }: { company_id: string | undefined } = useParams();

  const queryClient = useQueryClient();

  const changeBranchForm: FormConfig = {
    formId: `changeBranchForm-${company_id}`,
    apiUrl: `${baseURL}/management_hierarchies/make-branch-main/${branchId}`,
    title: "اضافة فرع جديد",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "branch_id",
            label: "نوع الفرع",
            type: "select",
            options: branches
              .filter((branch) => branch.parent_id)
              .map((branch) => ({
                value: branch.id,
                label: branch.name,
              })),
            validation: [
              {
                type: "required",
                message: "ادخل نوع الفرع",
              },
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
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    className: "overflow-visible",
    wrapperClassName: "overflow-y-visible",

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["company-branches",  company_id],
      });
    },

    onSubmit: async (formData) => {
      return await defaultSubmitHandler(formData, changeBranchForm, {
        url: `${baseURL}/management_hierarchies/make-branch-main/${branchId}`,
        config: {
          params: {
            ...(company_id && { company_id }),
          },
        },
      });
    },
  };
  return changeBranchForm;
};
