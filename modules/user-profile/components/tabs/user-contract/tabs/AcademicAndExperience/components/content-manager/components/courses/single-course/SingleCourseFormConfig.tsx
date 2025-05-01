import { FormConfig } from "@/modules/form-builder";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { Course } from "@/modules/user-profile/types/Course";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

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
            validation: [
              {
                type: "required",
                message: "اسم الشركة مطلوب",
              },
            ],
          },
          {
            name: "authority",
            label: "الجهة",
            type: "text",
            placeholder: "الجهة",
            validation: [
              {
                type: "required",
                message: "الجهة مطلوب",
              },
            ],
          },
          {
            name: "name",
            label: "اسم الدورة التدريبية ",
            type: "text",
            placeholder: "اسم الدورة التدريبية ",
            validation: [
              {
                type: "required",
                message: "اسم الدورة التدريبية  مطلوب",
              },
            ],
          },
          {
            name: "institute",
            label: "جهة الاعتماد",
            type: "text",
            placeholder: "جهة الاعتماد",
            validation: [
              {
                type: "required",
                message: "جهة الاعتماد مطلوب",
              },
            ],
          },
          {
            name: "certificate",
            label: "الشهادات الممنوحة",
            type: "text",
            placeholder: "الشهادات الممنوحة",
            validation: [
              {
                type: "required",
                message: "الشهادات الممنوحة مطلوب",
              },
            ],
          },
          {
            name: "date_obtain",
            label: "تاريخ الحصول على الشهادة",
            type: "date",
            placeholder: "تاريخ الحصول على الشهادة",
            validation: [
              {
                type: "required",
                message: "تاريخ الحصول على الشهادة مطلوب",
              },
            ],
          },
          {
            name: "date_end",
            label: "تاريخ انتهاء الشهادة",
            type: "date",
            placeholder: "تاريخ انتهاء الشهادة",
            validation: [
              {
                type: "required",
                message: "تاريخ انتهاء الشهادة مطلوب",
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

      const method = formType === "Edit" ? "PUT" : "POST";

      return await defaultSubmitHandler(body, singleCourseFormConfig, {
        url: url,
        method: method,
      });
    },
  };
  return singleCourseFormConfig;
};
