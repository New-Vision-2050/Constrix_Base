import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFunctionalContractualCxt } from "../../context";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const JobFormConfig = () => {
  const { user, handleRefetchDataStatus, companyId } = useUserProfileCxt();
  const { professionalData, company, handleRefetchProfessionalData } =
    useFunctionalContractualCxt();

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
              url: `${baseURL}/management_hierarchies/list?type=branch&company_id=${
                companyId || company?.id
              }`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
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
              url: `${baseURL}/management_hierarchies/list?type=management&company_id=${
                companyId || company?.id
              }`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",

              dependsOn: "branch_id",
              filterParam: "branch_id",
            },
            validation: [
              {
                type: "required",
                message: "الادارة مطلوب",
              },
            ],
          },
          // {
          //   name: "department_id",
          //   label: "القسم",
          //   type: "select",
          //   placeholder: "القسم",
          //   required: true,
          //   dynamicOptions: {
          //     url: `${baseURL}/management_hierarchies/list?type=department&company_id=${
          //       companyId || company?.id
          //     }`,
          //     valueField: "id",
          //     labelField: "name",
          //     searchParam: "name",
          //     paginationEnabled: true,
          //     totalCountHeader: "X-Total-Count",

          //     dependsOn: "management_id",
          //     filterParam: "parentId",
          //   },
          //   validation: [
          //     {
          //       type: "required",
          //       message: "القسم مطلوب",
          //     },
          //   ],
          // },
          {
            name: "job_type_id",
            label: "نوع الوظيفة",
            type: "select",
            placeholder: "نوع الوظيفة",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/job_types/list?company_id=${
                companyId || company?.id
              }`,
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
              url: `${baseURL}/job_titles/list?company_id=${
                companyId || company?.id
              }`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "job_type_id",
              filterParam: "job_type_id",
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
          {
            name: "attendance_constraint_id",
            label: "المحدد",
            type: "select",
            placeholder: "المحدد",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/attendance/constraints/list`,
              valueField: "id",
              labelField: "constraint_name",
              searchParam: "constraint_name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "المحدد مطلوب",
              },
            ],
          },
           {
            name: "roles",
            label: "الصلاحيات",
            type: "select",
            placeholder: "الصلاحيات",
            required: true,
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/role_and_permissions/roles`,
              valueField: "name",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "المحدد مطلوب",
              },
            ],
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      branch_id: professionalData?.branch?.id,
      management_id: professionalData?.management?.id,
      department_id: professionalData?.department?.id,
      job_type_id: professionalData?.job_type?.id,
      job_title_id: professionalData?.job_title?.id,
      job_code: professionalData?.job_code,
      attendance_constraint_id: professionalData?.attendance_constraint?.id,
      roles: professionalData?.roles,
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
      handleRefetchDataStatus();
      handleRefetchProfessionalData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
        user_id: user?.user_id,
      };

      return await defaultSubmitHandler(serialize(body), jobFormConfig, {
        url: `/user_professional_data`,
        method: "POST",
      });
    },
  };
  return jobFormConfig;
};
