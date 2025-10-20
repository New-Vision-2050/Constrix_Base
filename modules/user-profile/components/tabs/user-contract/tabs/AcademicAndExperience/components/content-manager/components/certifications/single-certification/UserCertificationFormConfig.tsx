import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { Certification } from "@/modules/user-profile/types/Certification";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { serialize } from "object-to-formdata";
import { useTranslations } from "next-intl";

type PropsT = {
  onSuccess?: () => void;
  certification?: Certification;
};

export const UserCertificationFormConfig = ({
  onSuccess,
  certification,
}: PropsT) => {
  // declare and define component state and variables
  const formType = certification ? "Edit" : "Create";
  const t = useTranslations('UserProfile.nestedTabs.certificationsData');
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
            label: t('professionalBodie'),
            placeholder: t('professionalBodiePlaceholder'),
            dynamicOptions: {
              url: `${baseURL}/professional_bodies/user/${
                user?.user_id
              }?now=${Date.now()}`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              setFirstAsDefault: true,
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [],
          },
          {
            name: "accreditation_name",
            label: t('accreditationName'),
            type: "text",
            placeholder: t('accreditationNamePlaceholder'),
            validation: [],
          },
          {
            name: "accreditation_number",
            label: t('accreditationNumber'),
            type: "text",
            placeholder: t('accreditationNumberPlaceholder'),
            validation: [],
          },
          {
            name: "accreditation_degree",
            label: t('accreditationDegree'),
            type: "text",
            placeholder: t('accreditationDegreePlaceholder'),
            validation: [],
          },
          {
            name: "date_obtain",
            label: t('dateObtain'),
            type: "date",
            maxDate: {
              formId: `user-certification-data-form-${certification?.id}`,
              field: "date_end",
            },
            placeholder: t('dateObtainPlaceholder'),
            validation: [],
          },
          {
            name: "date_end",
            label: t('dateEnd'),
            type: "date",
            minDate: {
              formId: `user-certification-data-form-${certification?.id}`,
              field: "date_obtain",
            },
            placeholder: t('dateEndPlaceholder'),
            validation: [],
          },
          {
            name: "file",
            label: t('file'),
            type: "file",
            // isMulti: true,
            fileConfig: {
              showThumbnails: true,
              allowedFileTypes: [
                "application/pdf", // pdf
                "image/jpeg", // jpeg & jpg
                "image/png", // png
              ],
            },
            placeholder: t('filePlaceholder'),
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
      // Initialize file field empty if editing existing certification
    },
    submitButtonText: t('submitButtonText'),
    cancelButtonText: t('cancelButtonText'),
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

      // Create a copy of the form data
      const formDataCopy = { ...formData };
      
      // Check if file is empty or not provided, and remove it if it's empty
      if (!formDataCopy.file) {
        delete formDataCopy.file;
      }
      
      // Create the final body
      const body = {
        ...formDataCopy,
        user_id: user?.user_id,
        date_obtain: formatDateYYYYMMDD(dateObtain),
        date_end: formatDateYYYYMMDD(endDate),
      };
      const url =
        formType === "Edit"
          ? `professional_certificates/${certification?.id}`
          : `professional_certificates`;

      const method = formType === "Edit" ? "POST" : "POST";

      // Use serialize function to properly handle multipart/form-data for files
      return await defaultSubmitHandler(serialize(body), userCertificationFormConfig, {
        url: url,
        method: method,
      });
    },
  };
  return userCertificationFormConfig;
};
