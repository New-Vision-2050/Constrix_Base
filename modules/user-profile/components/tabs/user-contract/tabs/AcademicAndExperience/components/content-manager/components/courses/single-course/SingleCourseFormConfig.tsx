import { FormConfig } from "@/modules/form-builder";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { Course } from "@/modules/user-profile/types/Course";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { serialize } from "object-to-formdata";

type PropsT = {
  course?: Course;
  onSuccess?: () => void;
};

export const SingleCourseFormConfig = ({ onSuccess, course }: PropsT) => {
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
            label: "اسم الشركة",
            type: "text",
            placeholder: "اسم الشركة",
            validation: [],
          },
          {
            name: "authority",
            label: "الجهة",
            type: "text",
            placeholder: "الجهة",
            validation: [],
          },
          {
            name: "name",
            label: "اسم الدورة التدريبية ",
            type: "text",
            placeholder: "اسم الدورة التدريبية ",
            validation: [],
          },
          {
            name: "institute",
            label: "جهة الاعتماد",
            type: "text",
            placeholder: "جهة الاعتماد",
            validation: [],
          },
          {
            name: "certificate",
            label: "الشهادات الممنوحة",
            type: "text",
            placeholder: "الشهادات الممنوحة",
            validation: [],
          },
          {
            name: "date_obtain",
            label: "تاريخ الحصول على الشهادة",
            type: "date",
            placeholder: "تاريخ الشهادة",
            validation: [],
            maxDate: {
              formId: `user-courses-data-form-${course?.id ?? ""}`,
              field: "date_end",
            },
          },
          {
            name: "date_end",
            label: "تاريخ انتهاء الشهادة",
            type: "date",
            placeholder: "تاريخ انتهاء الشهادة",
            minDate: {
              formId: `user-courses-data-form-${course?.id ?? ""}`,
              field: "date_obtain",
            },
            validation: [
              {
                type: "custom",
                message:
                  "تاريخ انتهاء الشهادة يجب أن يكون بعد تاريخ الحصول على الشهادة",
                validator: (value, allValues) => {
                  if (!value || !allValues?.date_obtain) return true;
                  return new Date(value) > new Date(allValues.date_obtain);
                },
              },
            ],
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
      company_name: course?.company_name,
      authority: course?.authority,
      name: course?.name,
      institute: course?.institute,
      certificate: course?.certificate,
      date_obtain: course?.date_obtain,
      date_end: course?.date_end,
      file: course?.file,
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
      handleRefetchUserCourses();
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
        formType === "Create"
          ? `/user_educational_courses`
          : `/user_educational_courses/${course?.id}`;

      const method = formType === "Edit" ? "POST" : "POST";

      return await defaultSubmitHandler(serialize(body), singleCourseFormConfig, {
        url: url,
        method: method,
      });
    },
  };
  return singleCourseFormConfig;
};
