import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import {
  convertHijriDate,
  getHijriDate,
} from "@/modules/table/components/ui/HijriCalendar";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const PersonalDataFormConfig = () => {
  const { user } = useUserProfileCxt();
  const { userPersonalData } = usePersonalDataTabCxt();
  const {
    handleRefetchUserPersonalData,
    handleRefetchProfileData,
    handleRefetchDataStatus,
  } = useUserProfileCxt();

  const PersonalFormConfig: FormConfig = {
    formId: `personal-data-form`,
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
            validation: [
              {
                type: "required",
                message: "الاسم مطلوب",
              },
            ],
          },
          {
            name: "nickname",
            label: "اسم الشهرة",
            type: "text",
            placeholder: "nick name",
            validation: [
              {
                type: "required",
                message: "الاسم الشهرة مطلوب",
              },
            ],
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
            validation: [
              {
                type: "required",
                message: "الجنس مطلوب",
              },
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
            onChange: (newValue, values) => {
              useFormStore
                ?.getState()
                .setValue(
                  "personal-data-form",
                  "birthdate_hijri",
                  getHijriDate(newValue)
                );
            },
            validation: [
              {
                type: "required",
                message: "التاريخ الميلادي مطلوب",
              },
            ],
          },
          {
            name: "birthdate_hijri",
            label: "تاريخ الهجري",
            type: "date",
            isHijri: true,
            placeholder: "Birthdate Hijri",
            onChange: (newValue, values) => {
              useFormStore
                ?.getState()
                .setValue(
                  "personal-data-form",
                  "birthdate_gregorian",
                  convertHijriDate(newValue)
                );
            },
            validation: [
              {
                type: "required",
                message: "التاريخ الهجري مطلوب",
              },
            ],
          },
          {
            name: "country_id",
            label: "الجنسية",
            type: "select",
            placeholder: "Nationality",
            dynamicOptions: {
              url: "/countries",
              valueField: "id",
              labelField: "name",
            },
            validation: [
              {
                type: "required",
                message: "الجنسية مطلوب",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      name: userPersonalData?.name,
      nickname: userPersonalData?.nickname,
      gender: userPersonalData?.gender,
      is_default: userPersonalData?.is_default == 1,
      birthdate_gregorian: userPersonalData?.birthdate_gregorian,
      birthdate_hijri: userPersonalData?.birthdate_hijri,
      country_id: userPersonalData?.country_id?.toString(),
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchProfileData();
      handleRefetchUserPersonalData();
      handleRefetchDataStatus();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        is_default: formData?.is_default ? 1 : 0,
      };

      return await defaultSubmitHandler(body, PersonalFormConfig, {
        url: `/company-users/data-info/${user?.user_id}`,
        method: "PUT",
      });
    },
  };
  return PersonalFormConfig;
};
