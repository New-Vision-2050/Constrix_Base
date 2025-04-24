import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export const JobFormConfig = () => {
  const { user, handleRefetchDataStatus } = useUserProfileCxt();

  const jobFormConfig: FormConfig = {
    formId: "job-data-form",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "branch_id",
            label: "الفرع",
            type: "select",
            placeholder: "الفرع",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies`,
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
                message: "الفرع مطلوب",
              },
            ],
          },
          {
            name: "management_id",
            label: "الادارة",
            type: "select",
            placeholder: "الادارة",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies?type=management`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",

              dependsOn: "parentId",
              filterParam: "branch_id",
            },
            validation: [
              {
                type: "required",
                message: "الادارة مطلوب",
              },
            ],
          },
          {
            name: "department_id",
            label: "القسم",
            type: "select",
            placeholder: "القسم",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies?type=department`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",

              dependsOn: "parentId",
              filterParam: "management_id",
            },
            validation: [
              {
                type: "required",
                message: "القسم مطلوب",
              },
            ],
          },
          {
            name: "job_type_id",
            label: "نوع الوظيفة",
            type: "select",
            placeholder: "نوع الوظيفة",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/job_types`,
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
                message: "نوع الوظيفة مطلوب",
              },
            ],
          },
          {
            name: "job_title_id",
            label: "المسمى الوظيفي",
            type: "select",
            placeholder: "المسمى الوظيفي",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/job_types`,
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
                message: "المسمى الوظيفي مطلوب",
              },
            ],
          },
          {
            name: "job_code",
            label: "الرقم الوظيفي",
            type: "text",
            placeholder: "الرقم الوظيفي",
            required: true,
            validation: [
              {
                type: "required",
                message: "الرقم الوظيفي مطلوب",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {},
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchDataStatus();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        user_id: user?.user_id,
      };

      console.log("asd.asd.asd.body", body);

      const response = await apiClient.post(`/user_salaries`, serialize(body));

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return jobFormConfig;
};
