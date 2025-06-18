import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const IdentityDataFormConfig = () => {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const { handleRefetchDataStatus, user } = useUserProfileCxt();

  const IdentityFormConfig: FormConfig = {
    formId: "Identity-data-form",
    title: "بيانات الهوية",
    apiUrl: `${baseURL}/company-users/identity-data`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "بيانات الهوية",
        fields: [
          {
            name: "identity",
            label: "رقم الهوية",
            type: "text",
            placeholder: "رقم الهوية",
            validation: [
              {
                type: "required",
                message: "رقم الهوية مطلوب",
              },
              {
                type: "pattern",
                value: /^[12]\d{9}$/,
                message:
                  "رقم الهوية يجب أن يتكون من 10 أرقام ويبدأ بالرقم 1 أو 2",
              },
              {
                type: "minLength",
                value: 10,
                message: "رقم الهوية يجب أن يتكون من 10 أرقام",
              },
              {
                type: "maxLength",
                value: 10,
                message: "رقم الهوية يجب أن يتكون من 10 أرقام",
              },
              {
                type: "pattern",
                value: /^\d+$/,
                message: "رقم الهوية يجب أن يحتوي على أرقام فقط",
              },
            ],
          },
          {
            label: "تاريخ الدخول",
            type: "date",
            name: "identity_start_date",
            placeholder: "تاريخ الدخول",
            validation: [
              {
                type: "required",
                message: "تاريخ الدخول مطلوب",
              },
            ],
            maxDate: {
              formId: `Identity-data-form`,
              field: "identity_end_date",
            },
          },
          {
            label: "تاريخ الانتهاء",
            type: "date",
            name: "identity_end_date",
            placeholder: "تاريخ الانتهاء",
            validation: [
              {
                type: "required",
                message: "تاريخ الأنتهاء مطلوب",
              },
            ],
            minDate: {
              formId: `Identity-data-form`,
              field: "identity_start_date",
              // shift:{
              //   value: -3, //any number
              //   unit: 'months' //'days' | 'months' | 'years' ===> default 'days'
              // }
            },
          },
          {
            label: "ارفاق الهوية",
            type: "file",
            isMulti: true,
            name: "file_identity",
            placeholder: "رقم جواز السفر",
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", // pdf
                "image/jpeg", // jpeg & jpg
                "image/png", // png
              ],
            },
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      identity: userIdentityData?.identity,
      identity_start_date: userIdentityData?.identity_start_date,
      identity_end_date: userIdentityData?.identity_end_date,
      file_identity: userIdentityData?.file_identity,
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefreshIdentityData();
      handleRefetchDataStatus();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const startDate = new Date(formData?.identity_start_date as string);
      const endDate = new Date(formData?.identity_end_date as string);

      const body = {
        ...formData,
        identity_start_date: formatDateYYYYMMDD(startDate),
        identity_end_date: formatDateYYYYMMDD(endDate),
      };

      return await defaultSubmitHandler(serialize(body), IdentityFormConfig, {
        url: `/company-users/identity-data/${user?.user_id}`,
        method: "POST",
      });
    },
  };
  return IdentityFormConfig;
};
