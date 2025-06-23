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
  const  t = useTranslations();
  const { user } = useUserProfileCxt();
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
            validation: [
              {
                type: "required",
                message: t("PersonalDataForm.nameRequired"),
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
                type: "required",
                message: t("PersonalDataForm.nicknameRequired"),
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
            validation: [
              {
                type: "required",
                message: t("PersonalDataForm.genderRequired"),
              },
            ],
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
            validation: [
              {
                type: "required",
                message: t("PersonalDataForm.birthdateGregorianRequired"),
              },
            ],
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
            validation: [
              {
                type: "required",
                message: t("PersonalDataForm.birthdateHijriRequired"),
              },
            ],
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

      return await defaultSubmitHandler(body, PersonalFormConfig, {
        url: `/company-users/data-info/${user?.user_id}`,
        method: "PUT",
      });
    },
  };
  return PersonalFormConfig;
};
