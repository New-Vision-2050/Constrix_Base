import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { Certification } from "@/modules/user-profile/types/Certification";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useTranslations } from "next-intl";

type PropsT = {
  onSuccess?: () => void;
  certification?: Certification;
};

export const UserCertificationFormConfig = ({
  onSuccess,
  certification,
}: PropsT) => {
  const t = useTranslations("AcademicExperience");
  // declare and define component state and variables
  const formType = certification ? "Edit" : "Create";
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchUserCertifications } = useUserAcademicTabsCxt();

  // form config
  const userCertificationFormConfig: FormConfig = {
    formId: `user-certification-data-form-${certification?.id}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "professional_bodie_id",
            label: t("Authority"),
            placeholder: t("EnterAuthority"), // Assuming placeholder should be "Enter Authority"
            required: true,
            dynamicOptions: {
              url: `${baseURL}/professional_bodies`,
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
                message: t("EnterAuthority"),
              },
            ],
          },
          {
            name: "accreditation_name",
            label: t("AccreditationName"),
            type: "text",
            placeholder: t("AccreditationName"),
            validation: [
              {
                type: "required",
                message: t("AccreditationNameRequired"),
              },
            ],
          },
          {
            name: "accreditation_number",
            label: t("AccreditationNumber"),
            type: "text",
            placeholder: t("AccreditationNumber"),
            validation: [
              {
                type: "required",
                message: t("AccreditationNumberRequired"),
              },
            ],
          },
          {
            name: "accreditation_degree",
            label: t("AccreditationDegree"),
            type: "text",
            placeholder: t("AccreditationDegree"),
            validation: [
              {
                type: "required",
                message: t("AccreditationDegreeRequired"),
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
      professional_bodie_id: certification?.professional_bodie_id,
      accreditation_name: certification?.accreditation_name,
      accreditation_number: certification?.accreditation_number,
      accreditation_degree: certification?.accreditation_degree,
      date_obtain: certification?.date_obtain,
      date_end: certification?.date_end,
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
      handleRefetchUserCertifications();
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
        formType === "Edit"
          ? `professional_certificates/${certification?.id}`
          : `professional_certificates`;
      const _apiClient = formType === "Edit" ? apiClient.put : apiClient.post;

      const response = await _apiClient(url, body);

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return userCertificationFormConfig;
};
