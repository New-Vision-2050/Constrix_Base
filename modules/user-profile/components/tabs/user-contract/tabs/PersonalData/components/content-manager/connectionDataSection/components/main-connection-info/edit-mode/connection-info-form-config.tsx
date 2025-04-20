import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useConnectionDataCxt } from "../../../context/ConnectionDataCxt";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { countryPhoneCodes } from "../../../../../../constants/ContriesPhoneCodeList";

export const ConnectionInformationFormConfig = () => {
  const { user } = useUserProfileCxt();
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
            name: "phone_code",
            label: "كود الدولة",
            type: "select",
            options: countryPhoneCodes?.map((item) => ({
              label: item,
              value: item,
            })),
          },
          {
            name: "phone",
            label: "رقم الجوال",
            type: "text",
            placeholder: "رقم الجوال",
          },
          {
            name: "email",
            label: "البريد الالكتروني",
            type: "text",
            placeholder: "البريد الالكتروني",
          },
          {
            name: "other_phone",
            label: "رقم   الجوال البديل",
            type: "text",
            placeholder: "رقم   الجوال البديل",
          },
          {
            name: "landline_number",
            label: "رقم الهاتف الأرضي",
            type: "text",
            placeholder: "رقم الهاتف الأرضي",
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
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
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
