import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { Qualification } from "@/modules/user-profile/types/qualification";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { serialize } from "object-to-formdata";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { useTranslations } from "next-intl";

type PropsT = {
  qualification?: Qualification;
  onSuccess?: () => void;
};
export const QualificationFormConfig = ({
  qualification,
  onSuccess,
}: PropsT) => {
  const t = useTranslations("AcademicExperience");
  const tCompanies = useTranslations("CompaniesForm"); // For reusing company-related translations
  // declare and define helper state and variables
  const formType = qualification ? "Edit" : "Create";
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();
  const { user, handleRefetchDataStatus } = useUserProfileCxt();

  // form config
  const qualificationFormConfig: FormConfig = {
    formId: `qualification-data-form-${qualification?.id ?? ""}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "country_id",
            label: t("GraduationCountry"),
            placeholder: tCompanies("SelectCompanyCountry"),
            required: true,
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
            validation: [
              {
                type: "required",
                message: tCompanies("EnterCompanyCountry"),
              },
            ],
          },
          {
            type: "select",
            name: "university_id",
            label: t("University"),
            placeholder: t("SelectUniversity"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/universities`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("EnterUniversity"),
              },
            ],
          },
          {
            type: "select",
            name: "academic_qualification_id",
            label: t("Qualification"),
            placeholder: t("SelectQualification"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/academic_qualifications`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("EnterQualification"),
              },
            ],
          },
          {
            type: "select",
            name: "academic_specialization_id",
            label: t("AcademicSpecialization"),
            placeholder: t("SelectAcademicSpecialization"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/academic_specializations`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("EnterAcademicSpecialization"),
              },
            ],
          },
          {
            type: "date",
            name: "graduation_date",
            label: t("CertificateAcquisitionDate"),
            placeholder: t("CertificateAcquisitionDate"),
            validation: [
              {
                type: "required",
                message: "graduation date is required",
              },
            ],
          },
          {
            type: "text",
            name: "study_rate",
            label: t("StudyGrades"),
            placeholder: t("StudyGrades"),
            validation: [
              {
                type: "required",
                message: "graduation grade is required",
              },
            ],
          },
          {
            type: "image",
            name: "graduation_file",
            label: t("AttachCertificate"),
            placeholder: t("AttachCertificate"),
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      country_id: qualification?.country_id,
      university_id: qualification?.university_id,
      academic_specialization_id: qualification?.academic_specialization_id,
      academic_qualification_id: qualification?.academic_qualification_id,
      graduation_date: qualification?.graduation_date,
      study_rate: qualification?.study_rate,
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: formType === "Create" ? true : false,
    showCancelButton: false,
    showBackButton: false,

    // Example onSuccess handler
    onSuccess: () => {
      onSuccess?.();
      handleRefetchDataStatus();
      handleRefreshUserQualifications();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Months are 0-based
        const day = `${date.getDate()}`.padStart(2, "0");

        return `${year}-${month}-${day}`;
      };
      const graduationDate = new Date(formData?.graduation_date as string);

      const body = {
        ...formData,
        user_id: user?.user_id,
        graduation_date: formatDate(graduationDate),
      };

      const url =
        formType === "Edit"
          ? `/qualifications/${qualification?.id}`
          : "/qualifications";

      // const _body = formType === "Edit" ? body : serialize(body);
      // const _apiClient = formType === "Edit" ? apiClient.put : apiClient.post;

      const response = await apiClient.post(url, serialize(body));

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return qualificationFormConfig;
};
