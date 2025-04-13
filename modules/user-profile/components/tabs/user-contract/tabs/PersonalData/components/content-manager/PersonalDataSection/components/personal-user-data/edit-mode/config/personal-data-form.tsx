import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";

export const PersonalDataFormConfig = () => {
  const { userPersonalData } = usePersonalDataTabCxt();
  const PersonalFormConfig: FormConfig = {
    formId: "personal-data-form",
    title: "البيانات الشخصية",
    apiUrl: `${baseURL}/company-users/data-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "name",
            label: "الاسم ثلاثي",
            type: "text",
            placeholder: "Name",
          },
          {
            name: "nickname",
            label: "اسم الشهرة",
            type: "text",
            placeholder: "nick name",
          },
          {
            name: "gender",
            label: "الجنس",
            type: "select",
            placeholder: "Gender",
            options: [
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ],
          },
          {
            name: "is_default",
            label: "افتراضي ؟",
            type: "checkbox",
            placeholder: "Is Default?",
          },
          {
            name: "birthdate_gregorian",
            label: "تاريخ الميلاد",
            type: "date",
            placeholder: "Birthdate Gregorian",
          },
          {
            name: "birthdate_hijri",
            label: "تاريخ الهجري",
            type: "date",
            placeholder: "Birthdate Hijri",
          },
          {
            name: "nationality",
            label: "الجنسية",
            type: "select",
            placeholder: "Nationality",
            dynamicOptions: {
              url: "/countries",
              valueField: "id",
              labelField: "name",
            },
          },
        ],
      },
    ],
    initialValues: {
      name: userPersonalData?.name,
      nickname: userPersonalData?.nickname,
      gender: userPersonalData?.gender,
      is_default: userPersonalData?.is_default == 1,
      birthdate_gregorian: userPersonalData?.birthdate_gregorian,
      birthdate_hijri: userPersonalData?.birthdate_hijri,
      nationality: userPersonalData?.nationality,
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
        is_default: formData?.is_default ? 1 : 0,
      };
      const response = await apiClient.put(`/company-users/data-info`, body);
      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return PersonalFormConfig;
};
