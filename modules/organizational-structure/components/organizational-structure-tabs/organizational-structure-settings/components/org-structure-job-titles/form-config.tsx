import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const OrgStructureSettingsFormConfig: FormConfig = {
  formId: "job-titles-form",
  title: "اضافة مسمى وظيفي",
  apiUrl: `${baseURL}/job_titles`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors", // This is the default in Laravel
  },
  sections: [
    {
      title: "اضافة مسمى وظيفي",
      fields: [
        {
          name: "name",
          label: "المسمي الوظيفي",
          type: "text",
          placeholder: "برجاء إدخال المسمي الوظيفي",
          required: true,
          validation: [
            {
              type: "required",
              message: `المسمي الوظيفي مطلوب`,
            },
          ],
        },
        {
          type: "select",
          name: "job_type_id",
          label: "نوع الوظيفة",
          placeholder: "اختر نوع الوظيفة",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/job_types/list`,
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
              message: "نوع الوظيفة",
            },
          ],
        },
        {
          name: "description",
          label: "وصف المسمى الوظيفي",
          type: "text",
          placeholder: "برجاء إدخال وصف المسمى الوظيفي",
          required: true,
          validation: [
            {
              type: "required",
              message: `وصف المسمى الوظيفي مطلوب`,
            },
          ],
        },
      ],
    },
  ],
  submitButtonText: "حفظ",
  showSubmitLoader: true,
  resetOnSuccess: true,
  showCancelButton: false,
};
