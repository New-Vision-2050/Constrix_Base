import { FormConfig } from "@/modules/form-builder";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { Experience } from "@/modules/user-profile/types/experience";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

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
                    type: "pattern",
                    value: "^[a-zA-Z\u0600-\u06FF\\s]+$",
                    message: "يجب أن يحتوي فقط على أحرف",
              }
            ],
          },
          {
            label: "تاريخ البداية",
            type: "date",
            name: "training_from",
            placeholder: "تاريخ البداية",
            maxDate: {
              formId: `user-experiences-data-form-${experience?.id ?? ""}`,
              field: "training_to",
            },
            validation: [],
          },
          {
            label: "تاريخ الانتهاء",
            type: "date",
            name: "training_to",
            placeholder: "تاريخ الانتهاء",
            minDate: {
              formId: `user-experiences-data-form-${experience?.id ?? ""}`,
              field: "training_from",
            },
          },
          {
            name: "company_name",
            label: "اسم الشركة",
            type: "text",
            placeholder: "اسم الشركة",
            validation: [],
          },
          {
            name: "about",
            label: "نبذه عن المشاريع والاعمال",
            type: "textarea",
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

      const method = formType === "Edit" ? "PUT" : "POST";

      return await defaultSubmitHandler(body, singleExperienceFormConfig, {
        url: url,
        method: method,
      });

    },
  };
  return singleExperienceFormConfig;
};
