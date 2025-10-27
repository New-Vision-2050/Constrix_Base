import { FormConfig } from "@/modules/form-builder";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { Experience } from "@/modules/user-profile/types/experience";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

type PropsT = {
  experience?: Experience;
  onSuccess?: () => void;
};

export const SingleExperienceFormConfig = ({
  experience,
  onSuccess,
}: PropsT) => {
  // declare and define component state and variables
  const formType = experience ? "Edit" : "Create";
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchUserExperiences } = useUserAcademicTabsCxt();
  const t = useTranslations('UserProfile.nestedTabs.academicExperience'); 

  //  form config
  const singleExperienceFormConfig: FormConfig = {
    formId: `user-experiences-data-form-${experience?.id ?? ""}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "job_name",
            label: t('jobName'),
            type: "text",
            placeholder: t('jobName'),
            validation: [
              {
                    type: "pattern",
                    value: "^[a-zA-Z\u0600-\u06FF\\s]+$",
                    message: t('jobNameValidation'),
              }
            ],
          },
          {
            label: t('startDate'),
            type: "date",
            name: "training_from",
            placeholder: t('startDate'),
            maxDate: {
              formId: `user-experiences-data-form-${experience?.id ?? ""}`,
              field: "training_to",
            },
            validation: [],
          },
          {
            label: t('endDate'),
            type: "date",
            name: "training_to",
            placeholder: t('endDate'),
            minDate: {
              formId: `user-experiences-data-form-${experience?.id ?? ""}`,
              field: "training_from",
            },
          },
          {
            name: "company_name",
            label: t('companyName'),
            type: "text",
            placeholder: t('companyName'),
            validation: [],
          },
          {
            name: "about",
            label: t('about'),
            type: "textarea",
            placeholder: t('about'),
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      job_name: experience?.job_name,
      training_from: experience?.training_from,
      training_to: experience?.training_to,
      company_name: experience?.company_name,
      about: experience?.about,
    },
    submitButtonText: t('save'),
    cancelButtonText: t('cancel'),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      onSuccess?.();
      handleRefetchDataStatus();
      handleRefetchUserExperiences();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const trainingTo = new Date(formData?.training_to as string);
      const trainingFrom = new Date(formData?.training_from as string);

      const body = {
        ...formData,
        user_id: user?.user_id ?? "",
        training_from: formatDateYYYYMMDD(trainingFrom),
        training_to: formatDateYYYYMMDD(trainingTo),
      };

      const url =
        formType === "Edit"
          ? `/user_experiences/${experience?.id}`
          : `/user_experiences`;

      const method = formType === "Edit" ? "PUT" : "POST";

      return await defaultSubmitHandler(body, singleExperienceFormConfig, {
        url: url,
        method: method,
      });

    },
  };
  return singleExperienceFormConfig;
};
