import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Qualification } from "@/modules/user-profile/types/qualification";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { serialize } from "object-to-formdata";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

type PropsT = {
  qualification?: Qualification;
  onSuccess?: () => void;
};
export const QualificationFormConfig = ({
  qualification,
  onSuccess,
}: PropsT) => {
  // declare and define helper state and variables
  const formType = qualification ? "Edit" : "Create";
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();
  const t = useTranslations("UserProfile.nestedTabs.qualificationsData");
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
            label: t("country"),
            placeholder: t("selectCountry"),
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
            validation: [],
          },
          {
            type: "select",
            name: "university_id",
            label: t("university"),
            placeholder: t("selectUniversity"),
            dynamicOptions: {
              url: `${baseURL}/universities`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              dependsOn: "country_id",
              filterParam: "country_id",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [],
          },
          {
            type: "select",
            name: "academic_qualification_id",
            label: t("academicQualification"),
            placeholder: t("selectAcademicQualification"),
            dynamicOptions: {
              url: `${baseURL}/academic_qualifications`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
            },
            validation: [],
          },
          {
            type: "select",
            name: "academic_specialization_id",
            label: t("academicSpecialization"),
            placeholder: t("selectAcademicSpecialization"),
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
              dependsOn: "academic_qualification_id",
              filterParam: "academic_qualification_id",
            },
            validation: [],
          },
          {
            type: "date",
            name: "graduation_date",
            label: t("graduationDate"),
            placeholder: t("graduationDate"),
            validation: [],
          },
          {
            type: "text",
            name: "study_rate",
            label: t("studyRate"),
            placeholder: t("studyRate"),
            validation: [
              {
                type: "pattern",
                value: "^[0-9]+(\\.[0-9]+)?$",
                message: t("studyRateValidation"),
              },
              {
                type: "min",
                value: 0,
                message: t("studyRateValidation"),
              },
              {
                type: "max",
                value: 100,
                message: t("studyRateValidation"),
              },
            ],
          },
          {
            type: "file",
            name: "file", //field name
            isMulti: true,
            label: t("attachDocument"),
            placeholder: t("attachDocument"),
            gridArea: 2,
            fileConfig: {
              allowedFileTypes: ["application/pdf", "image/jpeg", "image/png"],
              maxFileSize: 200 * 1024 * 1024, // 200MB
            },
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
      file: qualification?.files,
    },
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
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

      return await defaultSubmitHandler(
        serialize(body),
        qualificationFormConfig,
        {
          url: url,
          method: "POST",
        }
      );
    },
  };
  return qualificationFormConfig;
};
