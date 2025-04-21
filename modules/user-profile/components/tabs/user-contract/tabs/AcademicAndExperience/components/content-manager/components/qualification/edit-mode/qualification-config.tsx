import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { Qualification } from "@/modules/user-profile/types/qualification";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { serialize } from "object-to-formdata";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";

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
            label: "دولة التخرج",
            placeholder: "اختر دولة الشركة",
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
                message: "ادخل دولة الشركة",
              },
            ],
          },
          {
            type: "select",
            name: "university_id",
            label: "الجامعة",
            placeholder: "اختر الجامعة",
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
                message: "ادخل الجامعة",
              },
            ],
          },
          {
            type: "select",
            name: "academic_qualification_id",
            label: "المؤهل",
            placeholder: "اختر المؤهل",
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
                message: "ادخل المؤهل",
              },
            ],
          },
          {
            type: "select",
            name: "academic_specialization_id",
            label: "التخصص الأكاديمي",
            placeholder: "اختر التخصص الأكاديمي",
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
                message: "ادخل التخصص الأكاديمي",
              },
            ],
          },
          {
            type: "date",
            name: "graduation_date",
            label: "تاريخ الحصول على الشهادة",
            placeholder: "تاريخ الحصول على الشهادة",
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
            label: "المعدلات الدراسية",
            placeholder: "المعدلات الدراسية",
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
            label: "ارفاق شهادة",
            placeholder: "ارفاق شهادة",
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
