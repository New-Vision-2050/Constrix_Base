import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const changeBranchForm = () => {
  const changeBranchForm: FormConfig = {
    formId: "changeBranchForm",
    apiUrl: `${baseURL}/write-ur-url`,
    title: "اضافة فرع جديد",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "branch_name",
            label: "نوع الفرع",
            type: "select",
            options: [{ label: "فرع الرياض", value: "فرع الرياض" }],
            validation: [
              {
                type: "required",
                message: "ادخل اسم الفرع",
              },
            ],
          },
        ],
      },
    ],
    submitButtonText: "حفظ",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
  };
  return changeBranchForm;
};
