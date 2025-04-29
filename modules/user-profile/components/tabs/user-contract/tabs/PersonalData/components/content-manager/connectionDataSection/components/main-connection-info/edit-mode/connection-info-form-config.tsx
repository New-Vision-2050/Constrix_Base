import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const ConnectionInformationFormConfig = () => {
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { userContactData } = useConnectionDataCxt();

  const _ConnectionInformationFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "البيانات الاتصال",
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "email",
            label: "البريد الالكتروني",
            type: "text",
            placeholder: "البريد الالكتروني",
            validation: [
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ],
          },
          {
            name: "phone",
            label: "رقم الجوال",
            type: "phone",
            placeholder: "رقم الجوال",
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },
          {
            name: "other_phone",
            label: "رقم   الجوال البديل",
            type: "phone",
            placeholder: "رقم   الجوال البديل",
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },
          {
            name: "landline_number",
            label: "رقم الهاتف الأرضي",
            type: "phone",
            placeholder: "رقم الهاتف الأرضي",
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      email: userContactData?.email,
      phone: userContactData?.phone,
      other_phone: userContactData?.other_phone,
      landline_number: userContactData?.landline_number,
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchDataStatus();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const phoneCode =
        ((formData?.phone as string) ?? "")?.split(" ")?.[0] ?? undefined;
      const otherPhoneCode =
        ((formData?.other_phone as string) ?? "")?.split(" ")?.[0] ?? undefined;
      const body = {
        ...formData,
        phone_code: phoneCode,
        code_other_phone: otherPhoneCode,
      };

      const response = await apiClient.put(
        `/contactinfos/${user?.user_id}`,
        body
      );
      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return _ConnectionInformationFormConfig;
};
