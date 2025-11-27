import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { RetrieveEmployeeFormConfig } from "@/modules/program-settings/users-settings/config/RetrieveEmployeeFormConfig";
import RetrieveEmployeeData from "@/modules/program-settings/components/retrieve-employee-data";
import { defaultSubmitHandler } from "../utils/defaultSubmitHandler";

export function employeeFormConfig(
  t: (key: string) => string,
  handleCloseForm?: () => void
): FormConfig {
  const formId = "employee-form";
  
  return {
    formId,
    title: t("SubEntitiesForm.AddEmployee"),
    apiUrl: `${baseURL}/company-users/employees`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        collapsible: false,
        fields: [
          {
            name: "roles",
            label: "roles",
            type: "hiddenObject",
          },
          {
            name: "payload",
            label: "payload",
            type: "hiddenObject",
          },
          {
            name: "employee_in_another_company",
            label: "employee_in_another_company",
            type: "hiddenObject",
          },
          {
            name: "employee_in_company",
            label: "employee_in_company",
            type: "hiddenObject",
          },
          {
            name: "user_id",
            label: "user_id",
            type: "hiddenObject",
          },
          // new email
          {
            name: "newEmail",
            label: "newEmail",
            type: "hiddenObject",
            defaultValue: false,
          },
          // mail is received
          {
            name: "mailReceived",
            label: "mailReceived",
            type: "hiddenObject",
            defaultValue: false,
          }, ////phone,first_name,last_name,country_id
          // email
          {
            name: "email",
            label: t("SubEntitiesForm.Email"),
            type: "email",
            placeholder: t("SubEntitiesForm.EnterEmail"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("SubEntitiesForm.EmailRequired"),
              },
              {
                type: "email",
                message: t("SubEntitiesForm.InvalidEmail"),
              },
              {
                type: "apiValidation",
                message: (
                  <RetrieveEmployeeData
                    formId={formId}
                    handleCloseForm={handleCloseForm}
                    dialogStatement={t("SubEntitiesForm.EmailAlreadyAdded")}
                    formConfig={(
                      userId: string,
                      branchesIds?: string[],
                      roleTwoIds?: string[], //client
                      roleThreeIds?: string[], //broker
                      handleOnSuccess?: () => void
                    ) =>
                      RetrieveEmployeeFormConfig(
                        userId,
                        branchesIds,
                        roleTwoIds,
                        roleThreeIds,
                        handleOnSuccess
                      )
                    }
                  />
                ),
                apiConfig: {
                  url: `${baseURL}/company-users/check-email`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  successCondition: (response) => {
                    const userId = response.payload?.[0]?.id || "";
                    const roles = response.payload?.[0]?.roles || [];

                    // check new email
                    const status_in_all_companies =
                      response.payload?.[0]?.status_in_all_companies || 0;
                    const status_in_company =
                      response.payload?.[0]?.status_in_company || 0;
                    if (
                      status_in_all_companies === 0 &&
                      status_in_company === 0
                    ) {
                      useFormStore.getState().setValues(formId, {
                        newEmail: true,
                      });
                      useFormStore.getState().setValues(formId, {
                        mailReceived: true,
                      });
                      return true;
                    }

                    // not new email
                    useFormStore.getState().setValues(formId, {
                      newEmail: false,
                    });
                    useFormStore.getState().setValues(formId, {
                      mailReceived: true,
                    });

                    // Update the roles in the form store
                    if (roles.length > 0) {
                      useFormStore.getState().setValues(formId, {
                        roles: JSON.stringify(roles),
                      });
                    }
                    // store the user ID in the form store
                    if (userId) {
                      useFormStore.getState().setValues(formId, {
                        user_id: userId,
                      });
                    }

                    // store payload
                    if (response.payload) {
                      useFormStore.getState().setValues(formId, {
                        payload: JSON.stringify(response.payload?.[0]),
                      });
                    }
                    // status = 0 --> mean exist in another company
                    useFormStore.getState().setValues(formId, {
                      employee_in_another_company:
                        response.payload?.[0]?.status,
                    });

                    useFormStore.getState().setValues(formId, {
                      employee_in_company:
                        response.payload?.[0]?.status_in_company,
                    });

                    return response.payload?.[0]?.status === 1;
                  },
                },
              },
            ],
          },
          // firstName
          {
            name: "first_name",
            label: t("SubEntitiesForm.FirstName"),
            type: "text",
            placeholder: t("SubEntitiesForm.EnterFirstName"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("SubEntitiesForm.FirstNameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicFirstName"),
              },
              {
                type: "minLength",
                value: 2,
                message: t("SubEntitiesForm.NameMinLength"),
              },
            ],
            condition: (values) => values.newEmail == true,
          },
          {
            name: "first_name",
            label: t("SubEntitiesForm.FirstName"),
            type: "text",
            placeholder: t("SubEntitiesForm.EnterFirstName"),
            disabled: true,
            condition: (values) => values.newEmail == false,
          },
          // lastName
          {
            name: "last_name",
            label: t("SubEntitiesForm.LastName"),
            type: "text",
            placeholder: t("SubEntitiesForm.EnterLastName"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("SubEntitiesForm.LastNameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicLastName"),
              },
              {
                type: "minLength",
                value: 2,
                message: t("SubEntitiesForm.NameMinLength"),
              },
            ],
            condition: (values) => values.newEmail == true,
          },
          {
            name: "last_name",
            label: t("SubEntitiesForm.LastName"),
            type: "text",
            placeholder: t("SubEntitiesForm.EnterLastName"),
            disabled: true,
            condition: (values) => values.newEmail == false,
          },
          // country
          {
            name: "country_id",
            label: t("SubEntitiesForm.Nationality"),
            type: "select",
            placeholder: t("SubEntitiesForm.ChooseNationality"),
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
            required: true,
            validation: [
              {
                type: "required",
                message: t("SubEntitiesForm.NationalityRequired"),
              },
            ],
            condition: (values) => values.newEmail == true,
          },
          {
            name: "country_id",
            label: t("SubEntitiesForm.Nationality"),
            type: "select",
            placeholder: t("SubEntitiesForm.ChooseNationality"),
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
            disabled: true,
            condition: (values) => values.newEmail == false,
          },
          // phone
          {
            name: "phone",
            label: t("SubEntitiesForm.Phone"),
            type: "phone",
            placeholder: t("SubEntitiesForm.EnterPhone"),
            required: true,
            validation: [
              { type: "required", message: t("SubEntitiesForm.PhoneRequired") },
              { type: "phone", message: t("SubEntitiesForm.InvalidPhone") },
            ],
            condition: (values) => values.newEmail == true,
          },
          {
            name: "phone",
            label: t("SubEntitiesForm.Phone"),
            type: "phone",
            placeholder: t("SubEntitiesForm.EnterPhone"),
            required: true,
            validation: [
              { type: "required", message: t("SubEntitiesForm.PhoneRequired") },
              { type: "phone", message: t("SubEntitiesForm.InvalidPhone") },
            ],
            disabled: true,
            condition: (values) => values.newEmail == false,
          },
          // jobTitle
          {
            type: "select",
            name: "job_title_id",
            label: t("SubEntitiesForm.JobTitle"),
            placeholder: t("SubEntitiesForm.ChooseJobTitle"),
            dynamicOptions: {
              url: `${baseURL}/job_titles/list`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              filterParam: "id",
            },
            condition: (values) => values.mailReceived == true,
          },
          {
            name: "job_title_id",
            label: t("SubEntitiesForm.JobTitle"),
            type: "select",
            placeholder: t("SubEntitiesForm.ChooseJobTitle"),
            dynamicOptions: {
              url: `${baseURL}/job_titles/list`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              filterParam: "id",
            },
            disabled: true,
            condition: (values) => values.mailReceived == false,
          },
          // branch
          {
            name: "branch_id",
            label: t("SubEntitiesForm.Branch"),
            type: "select",
            placeholder: t("SubEntitiesForm.ChooseBranch"),
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=branch`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            condition: (values) => values.mailReceived == true,
          },
          {
            name: "branch_id",
            label: t("SubEntitiesForm.Branch"),
            type: "select",
            placeholder: t("SubEntitiesForm.ChooseBranch"),
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/list?type=branch`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            disabled: true,
            condition: (values) => values.mailReceived == false,
          },
          // status
          {
            name: "status",
            label: t("SubEntitiesForm.EmployeeStatus"),
            type: "select",
            placeholder: t("SubEntitiesForm.ChooseEmployeeStatus"),
            options: [
              { label: t("SubEntitiesForm.Active"), value: "1" },
              { label: t("SubEntitiesForm.Inactive"), value: "0" },
            ],
            condition: (values) => values.mailReceived == true,
          },
          {
            name: "status",
            label: t("SubEntitiesForm.EmployeeStatus"),
            type: "select",
            placeholder: t("SubEntitiesForm.ChooseEmployeeStatus"),
            options: [
              { label: t("SubEntitiesForm.Active"), value: "1" },
              { label: t("SubEntitiesForm.Inactive"), value: "0" },
            ],
            disabled: true,
            condition: (values) => values.mailReceived == false,
          },
        ],
      },
    ],
    onSubmit: async (formData) => {
      console.log("formData10111", formData);
      const body = {
        ...formData,
        country_id: Boolean(formData?.country_id) ? formData?.country_id : null,
        first_name: formData?.first_name || null,
        last_name: formData?.last_name || null,
        phone: formData?.phone || null
      };

      return await defaultSubmitHandler(body, employeeFormConfig(t));
    },
    submitButtonText: t("SubEntitiesForm.Save"),
    cancelButtonText: t("SubEntitiesForm.Cancel"),
    showReset: false,
    resetButtonText: t("SubEntitiesForm.ClearForm"),
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
