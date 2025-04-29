import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { Experience } from "@/modules/user-profile/types/experience";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";

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
            label: "المسمى الوظيفي",
            type: "text",
            placeholder: "المسمى الوظيفي",
            validation: [
              {
                type: "required",
                message: "المسمى الوظيفي مطلوب",
              },
            ],
          },
          {
            label: "تاريخ البداية",
            type: "date",
            name: "training_from",
            placeholder: "تاريخ البداية",
            maxDate: {
              formId: `user-experiences-data-form-${experience?.id ?? ""}`,
              field: 'training_to'
            },
            validation: [
              {
                type: "required",
                message: "تاريخ البداية مطلوب",
              },
            ],
          },
          {
            label: "تاريخ الانتهاء",
            type: "date",
            name: "training_to",
            placeholder: "تاريخ الانتهاء",
            minDate: {
              formId: `user-experiences-data-form-${experience?.id ?? ""}`,
              field: 'training_from'
            },
          },
          {
            name: "company_name",
            label: "اسم الشركة",
            type: "text",
            placeholder: "اسم الشركة",
            validation: [
              {
                type: "required",
                message: "اسم الشركة مطلوب",
              },
            ],
          },
          {
            name: "about",
            label: "نبذه عن المشاريع والاعمال",
            type: "text",
            placeholder: "نبذه عن المشاريع والاعمال",
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
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
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
