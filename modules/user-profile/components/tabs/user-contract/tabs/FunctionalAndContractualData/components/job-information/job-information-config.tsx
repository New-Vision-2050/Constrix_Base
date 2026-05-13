import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useTranslations } from "next-intl";
import { useFunctionalContractualCxt } from "../../context";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const JobFormConfig = () => {
  const t = useTranslations("common");
  const tActions = useTranslations("UserProfile.nestedTabs.commonActions");
  const tJobData = useTranslations("UserProfile.nestedTabs.jobData");
  const { userId, handleRefetchDataStatus, companyId } = useUserProfileCxt();
  const {
    professionalData,
    company,
    handleRefetchProfessionalData,
    additionalConstraints,
    handleRefetchAdditionalConstraints,
  } = useFunctionalContractualCxt();

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
            label: tJobData("branch"),
            type: "select",
            placeholder: tJobData("branch"),
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
                message: tJobData("validation.branchRequired"),
              },
            ],
          },
          {
            name: "management_id",
            label: tJobData("management"),
            type: "select",
            placeholder: tJobData("management"),
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
                message: tJobData("validation.managementRequired"),
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
            label: tJobData("jobType"),
            type: "select",
            placeholder: tJobData("jobType"),
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
                message: tJobData("validation.jobTypeRequired"),
              },
            ],
          },
          {
            name: "job_title_id",
            label: tJobData("jobTitle"),
            type: "select",
            placeholder: tJobData("jobTitle"),
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
                message: tJobData("validation.jobTitleRequired"),
              },
            ],
          },
          {
            name: "job_code",
            label: tJobData("jobCode"),
            type: "text",
            placeholder: tJobData("jobCode"),
            required: true,
            validation: [
              {
                type: "required",
                message: tJobData("validation.jobCodeRequired"),
              },
            ],
          },
          {
            name: "attendance_constraint_id",
            label: tJobData("attendanceConstraint"),
            type: "select",
            placeholder: tJobData("attendanceConstraint"),
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
                message: tJobData("validation.attendanceConstraintRequired"),
              },
            ],
          },
          {
            name: "additional_constraint_ids",
            label: tJobData("additionalAttendanceConstraints"),
            type: "select",
            placeholder: tJobData("additionalAttendanceConstraints"),
            required: false,
            isMulti: true,
            dynamicOptions: {
              url: `${baseURL}/attendance/constraints/list`,
              valueField: "id",
              labelField: "constraint_name",
              searchParam: "constraint_name",
              paginationEnabled: true,
              totalCountHeader: "X-Total-Count",
            },
          },
           {
            name: "roles",
            label: tJobData("roles"),
            type: "select",
            placeholder: tJobData("roles"),
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
                message: tJobData("validation.rolesRequired"),
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
      additional_constraint_ids: additionalConstraints.map((c) => c.id),
      roles: professionalData?.roles,
    },
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: tActions("clearForm"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchDataStatus();
      handleRefetchProfessionalData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const { additional_constraint_ids, ...restData } = formData;

      const body = {
        ...restData,
        user_id: userId,
      };

      const result = await defaultSubmitHandler(serialize(body), jobFormConfig, {
        url: `/user_professional_data`,
        method: "POST",
      });

      if (userId) {
        await apiClient.post(
          `/attendance/constraints/users/${userId}/additional`,
          { constraint_ids: (additional_constraint_ids as string[]) ?? [] }
        );
        handleRefetchAdditionalConstraints();
      }

      return result;
    },
  };
  return jobFormConfig;
};
