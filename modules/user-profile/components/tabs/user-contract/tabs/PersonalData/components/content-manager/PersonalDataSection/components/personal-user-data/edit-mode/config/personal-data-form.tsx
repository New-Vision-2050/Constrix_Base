import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import {
  convertHijriDate,
  getHijriDate,
} from "@/modules/table/components/ui/HijriCalendar";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

export const PersonalDataFormConfig = () => {
  const t = useTranslations();
  const { userId } = useUserProfileCxt();
  const { userPersonalData } = usePersonalDataTabCxt();
  const {
    handleRefetchUserPersonalData,
    handleRefetchProfileData,
    handleRefetchDataStatus,
  } = useUserProfileCxt();

  const PersonalFormConfig: FormConfig = {
    formId: `personal-data-form`,
    title: t("PersonalDataForm.title"),
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
            label: t("PersonalDataForm.name"),
            type: "text",
            placeholder: t("PersonalDataForm.namePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("PersonalDataForm.nameRequired"),
              },
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty (handled by required validation)
                  const nameTerms = value
                    .trim()
                    .split(/\s+/)
                    .filter((term) => term.length > 0);
                  return nameTerms.length === 3;
                },
                message:
                  t("PersonalDataForm.nameThreeTerms") ||
                  "الاسم يجب أن يتكون من ثلاثة مقاطع فقط (الأول والأوسط والأخير)",
              },
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty (handled by required validation)
                  // Regex to match only Arabic and English letters and spaces
                  const lettersOnlyRegex = /^[\u0600-\u06FF\s\u0020a-zA-Z]+$/;
                  return lettersOnlyRegex.test(value);
                },
                message:
                  t("PersonalDataForm.nameLettersOnly") ||
                  "يجب أن يحتوي الاسم على حروف فقط (بدون أرقام أو رموز)",
              },
            ],
          },
          {
            name: "nickname",
            label: t("PersonalDataForm.nickname"),
            type: "text",
            placeholder: t("PersonalDataForm.nicknamePlaceholder"),
            validation: [
              {
                type: "custom",
                validator: (value: string) => {
                  if (!value) return true; // Skip if empty
                  // Check if the value contains only letters (Arabic or English) and spaces
                  const lettersOnlyRegex = /^[\u0600-\u06FF\s\u0020a-zA-Z]+$/;
                  return lettersOnlyRegex.test(value);
                },
                message:
                  t("PersonalDataForm.nameLettersOnly") ||
                  "يجب أن يحتوي اللقب على حروف فقط (بدون أرقام أو رموز)",
              },
            ],
          },
          {
            name: "gender",
            label: t("PersonalDataForm.gender"),
            type: "select",
            placeholder: t("PersonalDataForm.genderPlaceholder"),
            options: [
              { label: t("PersonalDataForm.genderMale"), value: "male" },
              { label: t("PersonalDataForm.genderFemale"), value: "female" },
            ],
            validation: [],
          },
          {
            name: "is_default",
            label: t("PersonalDataForm.is_default"),
            type: "checkbox",
            placeholder: t("PersonalDataForm.isDefaultPlaceholder"),
          },
          {
            name: "birthdate_gregorian",
            label: t("PersonalDataForm.birthdate_gregorian"),
            type: "date",
            placeholder: t("PersonalDataForm.birthdateGregorianPlaceholder"),
            onChange: (newValue, values) => {
              useFormStore
                ?.getState()
                .setValue(
                  "personal-data-form",
                  "birthdate_hijri",
                  getHijriDate(newValue)
                );
            },
            validation: [],
            maxDate: {
              value: new Date().toDateString()
            }
          },
          {
            name: "birthdate_hijri",
            label: t("PersonalDataForm.birthdate_hijri"),
            type: "date",
            isHijri: true,
            placeholder: t("PersonalDataForm.birthdateHijriPlaceholder"),
            onChange: (newValue, values) => {
              useFormStore
                ?.getState()
                .setValue(
                  "personal-data-form",
                  "birthdate_gregorian",
                  convertHijriDate(newValue)
                );
            },
            validation: [],
            maxDate: {
              value: new Date().toDateString()
            }
          },
          {
            name: "country_id",
            label: t("PersonalDataForm.country_id"),
            type: "select",
            placeholder: t("PersonalDataForm.countryPlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/countries`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            required: true,
            validation: [
              {
                type: "required",
                message: t("PersonalDataForm.countryRequired"),
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
    submitButtonText: t("PersonalDataForm.submitButtonText"),
    cancelButtonText: t("PersonalDataForm.cancelButtonText"),
    showReset: false,
    resetButtonText: t("PersonalDataForm.resetButtonText"),
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

      const url = Boolean(userId) ? `/company-users/data-info/${userId}` : `${baseURL}/company-users/data-info`;
      return await defaultSubmitHandler(body, PersonalFormConfig, {
        url: url,
        method: "PUT",
      });
    },
  };
  return PersonalFormConfig;
};
