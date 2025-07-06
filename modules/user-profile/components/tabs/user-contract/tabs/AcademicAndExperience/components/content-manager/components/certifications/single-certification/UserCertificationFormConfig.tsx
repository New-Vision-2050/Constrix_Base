import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { Certification } from "@/modules/user-profile/types/Certification";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { serialize } from "object-to-formdata";

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
            label: "الجهة",
            placeholder: "اختر الجهة",
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
            label: "اسم الاعتماد",
            type: "text",
            placeholder: "اسم الاعتماد",
            validation: [],
          },
          {
            name: "accreditation_number",
            label: "رقم الاعتماد",
            type: "text",
            placeholder: "رقم الاعتماد ",
            validation: [],
          },
          {
            name: "accreditation_degree",
            label: "درجة الاعتماد",
            type: "text",
            placeholder: "درجة الاعتماد",
            validation: [],
          },
          {
            name: "date_obtain",
            label: "تاريخ الحصول على الشهادة",
            type: "date",
            maxDate: {
              formId: `user-certification-data-form-${certification?.id}`,
              field: "date_end",
            },
            placeholder: "تاريخ الشهادة",
            validation: [],
          },
          {
            name: "date_end",
            label: "تاريخ انتهاء الشهادة",
            type: "date",
            minDate: {
              formId: `user-certification-data-form-${certification?.id}`,
              field: "date_obtain",
            },
            placeholder: "تاريخ انتهاء الشهادة",
            validation: [],
          },
          {
            name: "file",
            label: "ارفاق الشهادة",
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
            placeholder: "ارفاق الشهادة",
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
      handleRefetchUserCertifications();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const dateObtain = new Date(formData?.date_obtain as string);
      const endDate = new Date(formData?.date_end as string);

      // Create a copy of the form data
      const formDataCopy = { ...formData };
      
      // Check if file is empty or not provided, and remove it if it's empty
      if (!formDataCopy.file || 
          (Array.isArray(formDataCopy.file) && formDataCopy.file.length === 0) || 
          (typeof formDataCopy.file === 'object' && Object.keys(formDataCopy.file).length === 0)) {
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
