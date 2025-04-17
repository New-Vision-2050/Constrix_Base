import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const PrivilegeItemFormConfig = () => {
  const { user } = useUserProfileCxt();

  const privilegeItemFormConfig: FormConfig = {
    formId: `privilege-form`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "privilege_id",
            label: "نوع البدل",
            placeholder: "اختر البدل",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/privileges`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "ادخل البدل",
              },
            ],
          },
          {
            name: "type_privilege",
            label: "نوع البدل",
            type: "text",
            placeholder: "نوع البدل",
            validation: [
              {
                type: "required",
                message: "نوع البدل مطلوب",
              },
            ],
          },
          {
            name: "rate",
            label: "معدل حساب النسبة من اصل الراتب",
            type: "text",
            placeholder: "معدل حساب النسبة من اصل الراتب",
            validation: [
              {
                type: "required",
                message: "معدل حساب النسبة من اصل الراتب مطلوب",
              },
            ],
          },
          {
            name: "description",
            label: "الدورة",
            type: "text",
            placeholder: "الدورة",
            validation: [
              {
                type: "required",
                message: "الدورة مطلوب",
              },
            ],
          },
          {
            name: "description",
            label: "وصف",
            type: "text",
            placeholder: "وصف",
            validation: [
              {
                type: "required",
                message: "وصف مطلوب",
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      // type_privilege,rate,description
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {},
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        user_id: user?.user_id,
      };

      const response = await apiClient.post(
        `/user_privileges`,
        serialize(body)
      );

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return privilegeItemFormConfig;
};
