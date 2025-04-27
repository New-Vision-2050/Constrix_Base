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
            name: "phone",
            label: "رقم الجوال",
            type: "phone",
            placeholder: "رقم الجوال",
            validation:[
              {
                type: "minLength",
                value: 8,
                message: "Phone must be at least 8 digits"
              },
              {
                type: "maxLength",
                value: 15,
                message: "Phone must be at most 15 digits"
              }
            ]
          },
          {
            name: "email",
            label: "البريد الالكتروني",
            type: "text",
            placeholder: "البريد الالكتروني",
            validation: [
              {
                type: "email",
                message: "Please enter a valid email address"
              }
            ]
          },
          {
            name: "other_phone",
            label: "رقم   الجوال البديل",
            type: "phone",
            placeholder: "رقم   الجوال البديل",
            validation:[
              {
                type: "minLength",
                value: 8,
                message: "Phone must be at least 8 digits"
              },
              {
                type: "maxLength",
                value: 15,
                message: "Phone must be at most 15 digits"
              }
            ]
          },
          {
            name: "landline_number",
            label: "رقم الهاتف الأرضي",
            type: "phone",
            placeholder: "رقم الهاتف الأرضي",
            validation:[
              {
                type: "minLength",
                value: 7,
                message: "landline must be at least 7 digits"
              },
              {
                type: "maxLength",
                value: 12,
                message: "landline must be at most 12 digits"
              }
            ]
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
      const body = {
        ...formData,
        phone_code: phoneCode,
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
