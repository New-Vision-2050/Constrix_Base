import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { Course } from "@/modules/user-profile/types/Course";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useTranslations } from "next-intl";

type PropsT = {
  course?: Course;
  onSuccess?: () => void;
};

export const SingleCourseFormConfig = ({ onSuccess, course }: PropsT) => {
  const t = useTranslations("AcademicExperience");
  // ** declare and define component state and variables
  const formType = course ? "Edit" : "Create";
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchUserCourses } = useUserAcademicTabsCxt();

  const singleCourseFormConfig: FormConfig = {
    formId: `user-courses-data-form-${course?.id ?? ""}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
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
            name: "authority",
            label: t("Authority"),
            type: "text",
            placeholder: t("Authority"),
            validation: [
              {
                type: "required",
                message: t("AuthorityRequired"),
              },
            ],
          },
          {
            name: "name",
            label: t("CourseName"),
            type: "text",
            placeholder: t("CourseName"),
            validation: [
              {
                type: "required",
                message: t("CourseNameRequired"),
              },
            ],
          },
          {
            name: "institute",
            label: t("AccreditationInstitute"),
            type: "text",
            placeholder: t("AccreditationInstitute"),
            validation: [
              {
                type: "required",
                message: t("AccreditationInstituteRequired"),
              },
            ],
          },
          {
            name: "certificate",
            label: t("CertificatesGranted"),
            type: "text",
            placeholder: t("CertificatesGranted"),
            validation: [
              {
                type: "required",
                message: t("CertificatesGrantedRequired"),
              },
            ],
          },
          {
            name: "date_obtain",
            label: t("CertificateAcquisitionDate"),
            type: "date",
            placeholder: t("CertificateAcquisitionDate"),
            validation: [
              {
                type: "required",
                message: t("CertificateAcquisitionDateRequired"),
              },
            ],
          },
          {
            name: "date_end",
            label: t("CertificateExpiryDate"),
            type: "date",
            placeholder: t("CertificateExpiryDate"),
            validation: [
              {
                type: "required",
                message: t("CertificateExpiryDateRequired"),
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      company_name: course?.company_name,
      authority: course?.authority,
      name: course?.name,
      institute: course?.institute,
      certificate: course?.certificate,
      date_obtain: course?.date_obtain,
      date_end: course?.date_end,
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
      handleRefetchUserCourses();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const dateObtain = new Date(formData?.date_obtain as string);
      const endDate = new Date(formData?.date_end as string);

      const body = {
        ...formData,
        user_id: user?.user_id,
        date_obtain: formatDateYYYYMMDD(dateObtain),
        date_end: formatDateYYYYMMDD(endDate),
      };
      const url =
        formType === "Create"
          ? `/user_educational_courses`
          : `/user_educational_courses/${course?.id}`;
      const _apiClient = formType === "Create" ? apiClient.post : apiClient.put;

      const response = await _apiClient(url, body);
      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return singleCourseFormConfig;
};
