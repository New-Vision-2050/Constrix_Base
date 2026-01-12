// Define the form configuration
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { defaultStepSubmitHandler } from "@/modules/form-builder/utils/defaultStepSubmitHandler";
import { TimeZoneCheckbox } from "../components/TimeZoneCheckbox";
import { InvalidMessage } from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import { useTranslations } from "next-intl";

export function GetCompaniesFormConfig(t:ReturnType<typeof useTranslations>): FormConfig {
  return {

    formId: "companies-form",
    title: t("AddCompanyForm.Title"),
    apiUrl: `${baseURL}/companies`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        title: t("AddCompanyForm.CreateCompanySectionTitle"),
        fields: [
          {
            type: "select",
            name: "country_id",
            label: t("AddCompanyForm.CountryLabel"),
            placeholder: t("AddCompanyForm.CountryPlaceholder"),
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
            onChange: (newVal, values) => {
              useFormStore.getState().setValue("companies-form", "local-time", {
                "country-id": newVal,
              });
            },
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.CountryRequired"),
              },
            ],
          },
          {
            name: "company_field_id",
            label: t("AddCompanyForm.CompanyFieldLabel"),
            type: "select",
            isMulti: true,
            placeholder: t("AddCompanyForm.CompanyFieldPlaceholder"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/company_fields`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.CompanyFieldRequired"),
              },
            ],
          },
          {
            name: "name",
            label: t("AddCompanyForm.TradeNameLabel"),
            type: "text",
            placeholder: t("AddCompanyForm.TradeNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.TradeNameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicName"),
              },
              {
                type: "apiValidation",
                message: t("AddCompanyForm.TradeNameApiMessage"),
                apiConfig: {
                  url: `${baseURL}/companies/validated`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "name",
                  successCondition: (response) => response.payload.status === 1,
                },
              },
            ],
          },
          {
            name: "user_name",
            label: t("AddCompanyForm.ShortNameLabel"),
            type: "text",
            placeholder: t("AddCompanyForm.ShortNamePlaceholder"),
            postfix: "constrix.com",
            containerClassName: "rtl:flex-row-reverse",
            required: true,
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.ShortNameRequired"),
              },
              {
                type: "pattern",
                value: /^[a-zA-Z]+$/,
                message: t("Validation.englishName"),
              },
              {
                type: "apiValidation",
                message: t("AddCompanyForm.ShortNameApiMessage"),
                apiConfig: {
                  url: `${baseURL}/companies/validated`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "user_name",
                  successCondition: (response) => response.payload.status === 1,
                },
              },

            ],
          },
          {
            type: "select",
            name: "general_manager_id",
            label: t("AddCompanyForm.SupportManagerLabel"),
            placeholder: t("AddCompanyForm.SupportManagerPlaceholder"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/users/admin-users`,
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
                message: t("AddCompanyForm.SupportManagerRequired"),
              },
            ],
          },
          {
            type: "checkbox",
            name: "change_local_time",
            label: t("AddCompanyForm.CompanyCheckboxLabel"),
            placeholder: t("AddCompanyForm.CompanyCheckboxPlaceholder"),
            render: (
              field: any,
              value: boolean,
              onChange: (value: boolean) => void
            ) => {
              return (
                <TimeZoneCheckbox
                  field={field}
                  value={value}
                  onChange={onChange}
                />
              );
            }
          },
          {
            type: "hiddenObject",
            name: "local-time",
            label: "local-time",
            condition(values) {
              return !!values["change_local_time"];
            },
            defaultValue: {
              companyType: "llc",
              employeeCount: 0,
              industry: "technology",
              taxExempt: false,
            },
          },
        ],
      },
      {
        title: t("AddCompanyForm.CreateUserSectionTitle"),
        collapsible: false,
        fields: [
          {
            type: "hiddenObject",
            name: "exist_user_id",
            label: "exist_user_id",
            defaultValue: "",
          },
          {
            type: "hiddenObject",
            name: "error_sentence",
            label: "error_sentence",
            defaultValue: "",
          },
          {
            type: "text",
            name: "company_id",
            label: t("AddCompanyForm.CompanyIdLabel"),
            placeholder: t("AddCompanyForm.CompanyIdPlaceholder"),
            required: true,
            disabled: true,
            hidden: true,
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.CompanyIdRequired"),
              },
            ],
          },
          {
            name: "first_name",
            label: t("AddCompanyForm.FirstNameLabel"),
            type: "text",
            placeholder: t("AddCompanyForm.FirstNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.FirstNameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicFirstName"),
              },
              {
                type: "minLength",
                value: 2,
                message: t("AddCompanyForm.NameMinLength"),
              },
            ],
          },
          {
            name: "last_name",
            label: t("AddCompanyForm.LastNameLabel"),
            type: "text",
            placeholder: t("AddCompanyForm.LastNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.LastNameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicLastName"),
              },
              {
                type: "minLength",
                value: 2,
                message: t("AddCompanyForm.NameMinLength"),
              },
            ],
          },
          {
            name: "email",
            label: t("AddCompanyForm.EmailLabel"),
            type: "email",
            placeholder: t("AddCompanyForm.EmailPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.EmailRequired"),
              },
              {
                type: "email",
                message: t("AddCompanyForm.EmailInvalid"),
              },
              {
                type: "apiValidation",
                message: <InvalidMessage formId="companies-form" />,
                apiConfig: {
                  url: `${baseURL}/company-users/check-email`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  successCondition: (response) => {
                    useFormStore.getState().setValues("companies-form", {
                      exist_user_id: response.payload?.[0]?.id,
                    });
                    useFormStore.getState().setValues("companies-form", {
                      error_sentence: response.payload?.[0]?.sentence,
                    });

                    return response.payload?.[0]?.status === 1;
                  },
                },
              },
            ],
          },
          {
            name: "phone",
            label: t("AddCompanyForm.PhoneLabel"),
            type: "phone",
            required: true,
            placeholder: t("AddCompanyForm.PhonePlaceholder"),
            validation: [
              {
                type: "phone",
                message: t("AddCompanyForm.PhoneInvalid"),
              },
            ],
          },
          {
            type: "select",
            name: "job_title_id",
            disabled: true,
            label: t("AddCompanyForm.JobTitleLabel"),
            placeholder: t("AddCompanyForm.JobTitlePlaceholder"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/job_titles/list`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              setFirstAsDefault: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("AddCompanyForm.JobTitleRequired"),
              },
            ],
          },
        ],
      },
    ],
    submitButtonText: t("AddCompanyForm.SubmitButtonText"),
    cancelButtonText: t("AddCompanyForm.CancelButtonText"),
    showReset: false,
    resetButtonText: t("AddCompanyForm.ResetButtonText"),
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,

    // Enable wizard mode
    //   wizard: true,
    accordion: true,
    wizardOptions: {
      showStepIndicator: false,
      showStepTitles: false,
      validateStepBeforeNext: true,
      allowStepNavigation: false,
      nextButtonText: t("AddCompanyForm.NextButtonText"),
      prevButtonText: t("AddCompanyForm.BackButtonText"),
      finishButtonText: t("AddCompanyForm.FinishButtonText"),
      // Enable submitting each step individually
      submitEachStep: true,
      submitButtonTextPerStep: t("AddCompanyForm.StepSubmitButtonText"),
      // API URLs for each step
      stepApiUrls: {
        0: `${baseURL}/companies`,
        1: `${baseURL}/company-users`,
      },
      // API headers for each step
      stepApiHeaders: {
        0: {
          "X-Location-API-Key": "location-api-key",
        },
        1: {
          "X-User-API-Key": "user-api-key",
        },
      },
      // Custom step submission handler (optional - will use defaultStepSubmitHandler if not provided)
      onStepSubmit: async (step, values) => {
        // Option to call default way to handle the step
        const result = await defaultStepSubmitHandler(
          step,
          values,
          GetCompaniesFormConfig(t)
        );
        console.log("result before success", result);
        useFormStore.getState().setValues("companies-form", {
          company_id: result?.data?.payload.id,
        });
        if (result.success) {
          // Simulate API call
          return new Promise((resolve) => {
            resolve({
              success: true,
              message: `Step ${step + 1} submitted successfully`,
              data: () => {
                console.log("result after success", result);
                useFormStore.getState().setValues("companies-form", {
                  company_id: result?.data?.payload.id,
                });
                return {
                  // For step 0 (location), return a generated ID
                  ...(step === 0 &&
                    result.data?.payload?.id && {
                      company_id: result.data.payload.id,
                    }),
                };
              },
            });
          });
        }
        return result;
      },
      // Handle step change
      onStepChange: (prevStep, nextStep, values) => {
        console.log(`Moving from step ${prevStep + 1} to step ${nextStep + 1}`);
        console.log("Current values:", values);
      },
    },
    editDataTransformer: (data) => {
      if (data.company_field) {
        data.company_field_id = (data?.company_field || []).map(
          (item: { id: string | number }) => item.id
        );
      }
      return data;
    },
  };
}
