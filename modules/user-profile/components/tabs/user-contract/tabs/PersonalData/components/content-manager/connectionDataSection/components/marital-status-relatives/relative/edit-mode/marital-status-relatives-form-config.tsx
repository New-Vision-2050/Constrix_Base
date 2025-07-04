import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Relative } from "@/modules/user-profile/types/relative";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useConnectionDataCxt } from "../../../../context/ConnectionDataCxt";
import { MaritalStatusList } from "../../marital-status-enum";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

type PropsT = {
  relative?: Relative;
  onSuccess?: () => void;
};

export const MaritalStatusRelativesFormConfig = (props: PropsT) => {
  const { relative, onSuccess } = props;
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchUserRelativesData } = useConnectionDataCxt();
  const formMode = !relative ? "Create" : "Edit";

  const maritalStatusRelativesFormConfig: FormConfig = {
    formId: `ConnectionInformation-relatives-data-form-${relative?.id ?? ""}`,
    title: "الحالة الاجتماعية / الاقارب",
    apiUrl: `${baseURL}/user_relatives`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "marital_status_id",
            label: "الحالة الاجتماعية",
            type: "select",
            options: MaritalStatusList,
            dynamicOptions: {
              url: `${baseURL}/marital_statuses`,
              valueField: "id",
              labelField: "name",
            },
            placeholder: "الحالة الاجتماعية",
          },
          {
            name: "name",
            label: "اسم شخص في حالة الطواري",
            type: "text",
            placeholder: "اسم شخص في حالة الطواري",
            validation: [
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty
                  // Check if the value contains only letters (Arabic or English) and spaces
                  const lettersOnlyRegex = /^[\u0600-\u06FF\s\u0020a-zA-Z]+$/;
                  return lettersOnlyRegex.test(value);
                },
                message: "يجب أن يحتوي الاسم على حروف فقط (بدون أرقام أو رموز)",
              },
            ],
          },
          {
            name: "relationship",
            label: "علاقة الشخص بحاله الطواري",
            type: "text",
            placeholder: "علاقة الشخص بحاله الطواري",
            validation: [
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty
                  // Check if the value contains only letters (Arabic or English) and spaces
                  const lettersOnlyRegex = /^[\u0600-\u06FF\s\u0020a-zA-Z]+$/;
                  return lettersOnlyRegex.test(value);
                },
                message: "يجب أن تحتوي العلاقة على حروف فقط (بدون أرقام أو رموز)",
              },
            ],
          },
          {
            name: "phone",
            label: " رقم الهاتف الخاص بجهة اتصال في حالة الطوارئ",
            type: "phone",
            placeholder: " رقم الهاتف الخاص بجهة اتصال في حالة الطوارئ",
            validation: [
              {
                type: "phone",
                message: "برجاء ادخال رقم هاتف صحيح",
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      marital_status: relative?.marital_status,
      name: relative?.name,
      phone: relative?.phone,
      relationship: relative?.relationship,
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: formMode === "Create" ? true : false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      onSuccess?.();
      handleRefetchDataStatus();
      handleRefetchUserRelativesData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const url =
        formMode === "Create"
          ? "/user_relatives"
          : `/user_relatives/${relative?.id}`;
      const method = formMode === "Create" ? "POST" : `PUT`;

      const body = {
        ...formData,
        user_id: user?.user_id,
      };

      return await defaultSubmitHandler(
        body,
        maritalStatusRelativesFormConfig,
        {
          url: url,
          method: method,
        }
      );
    },
  };
  return maritalStatusRelativesFormConfig;
};
