import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { Experience } from "@/modules/user-profile/types/experience";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useTranslations } from "next-intl";

type PropsT = {
  experience?: Experience;
  onSuccess?: () => void;
};

export const SingleExperienceFormConfig = ({
  experience,
  onSuccess,
}: PropsT) => {
  const t = useTranslations("AcademicExperience");
  const tCompanyUser = useTranslations("CompanyUserForm"); // For JobTitle
  // declare and define component state and variables
  const formType = experience ? "Edit" : "Create";
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchUserExperiences } = useUserAcademicTabsCxt();

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
            label: tCompanyUser("JobTitle"),
            type: "text",
            placeholder: tCompanyUser("JobTitle"),
            validation: [
              {
                type: "required",
                message: t("JobTitleRequired"),
              },
            ],
          },
          {
            label: t("StartDateRequired"), // Assuming StartDateRequired implies the label too
            type: "date",
            name: "training_from",
            placeholder: t("StartDateRequired"),
            validation: [
              {
                type: "required",
                message: t("StartDateRequired"),
              },
            ],
          },
          {
            label: t("CertificateExpiryDate"), // Reusing CertificateExpiryDate label
            type: "date",
            name: "training_to",
            placeholder: t("CertificateExpiryDate"),
          },
          {
            name: "company_name",
            label: t("CompanyName"),
            type: "text",
            placeholder: t("CompanyName"),
            validation: [
              {
                type: "required",
                message: t("CompanyNameRequired"),
              },
            ],
          },
          {
            name: "about",
            label: t("BriefAboutProjects"),
            type: "text",
            placeholder: t("BriefAboutProjects"),
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
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
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

      const _apiClient = formType === "Edit" ? apiClient.put : apiClient.post;

      const response = await _apiClient(url, body);

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return singleExperienceFormConfig;
};
