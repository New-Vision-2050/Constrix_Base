// Define the form configuration
import React from "react";
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { TimeZoneCheckbox } from "@/modules/form-builder/components/TimeZoneCheckbox";
import InvalidClientMailDialog from "../individual/InvalidClientMailDialog";
import { defaultStepSubmitHandler } from "@/modules/form-builder/utils/defaultStepSubmitHandler";
import { GetCompaniesFormConfig } from "@/modules/form-builder/configs/companiesFormConfig";
import AddressDialog from "../individual/AddressDialog";

export function getCreateCompanyClientFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void,
  currentEmpBranchId?: string,
  currentEmpId?: string,
  isShareClient?: boolean,
  companyBranchesIds?: string[]
): FormConfig {
  const formId = "company-client-form";

  return {
    formId,
    title: t("form.title"),
    apiUrl: `${baseURL}/company-users/clients`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    // initialValues: {
    //   branch_ids: isShareClient ? companyBranchesIds : [currentEmpBranchId],
    // },
    sections: [
      {
        title: t("form.companyClientFormTitle"),
        fields: [
          {
            type: "select",
            name: "country_id",
            label: t("form.country"),
            placeholder: t("form.countryPlaceholder"),
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
              useFormStore.getState().setValue(formId, "local-time", {
                "country-id": newVal,
              });
            },
            validation: [
              {
                type: "required",
                message: t("form.countryRequired"),
              },
            ],
          },
          {
            name: "company_field_id",
            label: t("form.companyField"),
            type: "select",
            isMulti: true,
            placeholder: t("form.companyFieldPlaceholder"),
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
                message: t("form.companyFieldRequired"),
              },
            ],
          },
          {
            name: "name",
            label: t("form.commerceName"),
            type: "text",
            placeholder: t("form.commerceNamePlaceholder"),
            required: true,
            validation: [
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("form.Validation.arabicName"),
              },
              {
                type: "apiValidation",
                message: "الاسم التجاري يجب ان يكون باللغة العربية",
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
            label: t("form.shortName"),
            type: "text",
            placeholder: t("form.shortNamePlaceholder"),
            postfix: "constrix.com",
            containerClassName: "rtl:flex-row-reverse",
            required: true,
            validation: [
              {
                type: "required",
                message: t("form.shortNameRequired"),
              },
              {
                type: "pattern",
                value: /^[a-zA-Z]+$/,
                message: t("form.Validation.englishName"),
              },
              {
                type: "apiValidation",
                message:
                  "الاسم المختصر يجب ان يكون بالغة الانجليزية ولا يتخلله رموز",
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
            label: t("form.supportResponsible"),
            placeholder: t("form.supportResponsiblePlaceholder"),
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
                message: t("form.supportResponsibleRequired"),
              },
            ],
          },
          {
            type: "checkbox",
            name: "change_local_time",
            label: "الشركة",
            placeholder: "اختر الشركة",
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
            },
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
        title: t("form.individualClientFormTitle"),
        fields: [
          //  dialog hidden message
          {
            name: "dialogMessage",
            label: "",
            type: "hiddenObject",
          },
          // prevent retrive user data?
          {
            name: "preventRetriveUserData",
            label: "",
            type: "hiddenObject",
            defaultValue: true,
          },
          // user id
          {
            name: "user",
            label: "",
            type: "hiddenObject",
            defaultValue: "{}",
          },
          //client type
          {
            name: "type", //1 --> mean  individual client, 2 --> mean company client
            label: "",
            type: "hiddenObject",
            defaultValue: "2",
          },
          // company id
          {
            name: "company_id",
            label: "",
            type: "hiddenObject",
            defaultValue: "",
          },
          // email
          {
            name: "email",
            label: t("form.email"),
            type: "email",
            placeholder: t("form.emailPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("form.emailRequired"),
              },
              {
                type: "email",
                message: t("form.emailInvalid"),
              },
              {
                type: "apiValidation",
                message: (
                  <InvalidClientMailDialog
                    formId={formId}
                    btnText={t("form.retrieveData")}
                  />
                ),
                apiConfig: {
                  url: `${baseURL}/company-users/check-email`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  successCondition: (response) => {
                    const userId = response.payload?.[0]?.user_id || "";
                    const roles = response.payload?.[0]?.roles || [];
                    const clientBranches =
                      roles.find((role: any) => role.role == 2)?.branches || [];
                    const statusInCompany = Boolean(
                      response.payload?.[0]?.status_in_company
                    );
                    const statusInAllCompanies = Boolean(
                      response.payload?.[0]?.status_in_all_companies
                    );
                    let _message = "";

                    if (!statusInCompany && !statusInAllCompanies) {
                      // not exist in system continue
                      return true;
                    }
                    const _user = {
                      userId: userId,
                      email: response.payload?.[0]?.email || "",
                      name: response.payload?.[0]?.name || "",
                      phone: response.payload?.[0]?.phone || "",
                      residence: response.payload?.[0]?.residence || "",
                    };

                    // store user id
                    useFormStore.getState().setValues(formId, {
                      user: JSON.stringify(_user),
                    });

                    /**
                     * roles
                     * 1 --> mean employee
                     * 2 --> mean client
                     * 3 --> mean broker
                     */
                    if (statusInCompany) {
                      // exist in company
                      const _currentEmpBranchId = currentEmpBranchId
                        ? Number(currentEmpBranchId)
                        : 0;
                      const _clientInBranch = clientBranches.find(
                        (branch: any) => branch.id === _currentEmpBranchId
                      );

                      if (Boolean(_clientInBranch)) {
                        //check if client exist in current branch prevent create
                        _message = t("form.clientMailExist");
                        useFormStore.getState().setValues(formId, {
                          dialogMessage: _message,
                        });
                        useFormStore.getState().setValues(formId, {
                          preventRetriveUserData: false,
                        });
                        return false;
                      } else {
                        // exist in company as client in another branch or employee or broker
                        const _employeeBranchs =
                          roles.find((role: any) => role.role == 1)?.branches ||
                          [];
                        const _brokerBranchs =
                          roles.find((role: any) => role.role == 3)?.branches ||
                          [];

                        useFormStore.getState().setValues(formId, {
                          preventRetriveUserData: true,
                        });

                        if (
                          Array.isArray(clientBranches) &&
                          clientBranches.length > 0
                        ) {
                          _message =
                            t("form.mailExistAsClient") +
                            ", " +
                            clientBranches
                              .map((branch: any) => branch.name)
                              .join(", ");
                        }

                        if (
                          Array.isArray(_employeeBranchs) &&
                          _employeeBranchs.length > 0
                        ) {
                          _message =
                            _message +
                            ", " +
                            t("form.mailExistAsEmployee") +
                            " " +
                            _employeeBranchs
                              .map((branch: any) => branch.name)
                              .join(", ");
                        }

                        if (
                          Array.isArray(_brokerBranchs) &&
                          _brokerBranchs.length > 0
                        ) {
                          _message =
                            _message +
                            ", " +
                            t("form.mailExistAsBroker") +
                            " " +
                            _brokerBranchs
                              .map((branch: any) => branch.name)
                              .join(", ");
                        }

                        useFormStore.getState().setValues(formId, {
                          dialogMessage: _message,
                        });

                        return false;
                      }
                    }

                    if (statusInAllCompanies) {
                      _message = t("form.mailExistInSystem");
                      useFormStore.getState().setValues(formId, {
                        dialogMessage: _message,
                      });
                      return false;
                    }

                    return true;
                  },
                },
              },
            ],
          },
          // phone
          {
            name: "phone",
            label: t("form.phone"),
            type: "phone",
            required: true,
            placeholder: t("form.phonePlaceholder"),
            validation: [
              {
                type: "phone",
                message: t("form.phoneInvalid"),
              },
            ],
          },
          // name
          {
            name: "clientName",
            label: t("form.name"),
            type: "text",
            placeholder: t("form.namePlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("form.nameRequired"),
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("form.arabicName"),
              },
              {
                type: "pattern",
                value: /^\S+\s+\S+\s+\S+$/,
                message:
                  t("form.nameThreeTerms") ||
                  "الاسم يجب أن يتكون من ثلاثة مقاطع فقط (الأول والأوسط والأخير)",
              },
              {
                type: "minLength",
                value: 2,
                message: t("form.nameMinLength"),
              },
            ],
          },
          // address dialog
          {
            name: "addressDialog",
            label: "",
            type: "text",
            render: () => {
              return <AddressDialog formId={formId} />;
            },
          },
          // identity --> residence
          {
            name: "residence",
            label: t("form.identity"),
            type: "text",
            placeholder: t("form.identityPlaceholder"),
            required: true,
            validation: [
              {
                type: "required",
                message: t("form.identityRequired"),
              },
              {
                type: "pattern",
                value: /^[12]\d{9}$/,
                message: t("form.identityPattern"),
              },
              {
                type: "minLength",
                value: 10,
                message: t("form.identityMinLength"),
              },
              {
                type: "maxLength",
                value: 10,
                message: t("form.identityMaxLength"),
              },
              {
                type: "pattern",
                value: /^\d+$/,
                message: t("form.identityPattern"),
              },
            ],
          },
          // branchs
          {
            name: "branch_ids",
            label: t("form.branches"),
            type: "select",
            isMulti: true,
            placeholder: t("form.branchesPlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/management_hierarchies/user-access/user/${currentEmpId}/branches?role=2`,
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
            // disabled: isShareClient,
          },
          // broker
          {
            name: "broker_id",
            label: t("form.broker"),
            type: "select",
            placeholder: t("form.brokerPlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/company-users/brokers`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
          },
          // chat mail
          {
            name: "chat_mail",
            label: t("form.correspondenceAddress"),
            type: "text",
            placeholder: t("form.correspondenceAddressPlaceholder"),
          },
        ],
      },
    ],
    accordion: true,
    wizardOptions: {
      showStepIndicator: false,
      showStepTitles: false,
      validateStepBeforeNext: true,
      allowStepNavigation: false,
      nextButtonText: "Continue",
      prevButtonText: "Back",
      finishButtonText: "حفظ",
      // Enable submitting each step individually
      submitEachStep: true,
      submitButtonTextPerStep: "التالي",
      // API URLs for each step
      stepApiUrls: {
        0: `${baseURL}/companies?is_client=1`,
        1: `${baseURL}/company-users/clients`,
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
        let body = values;
        console.log("Breakpoint101 step,values ::", step, values);
        if (step === 1) {
          body = {
            ...values,
            name: values.clientName,
            company_id: values.company_id,
          };
        }
        const result = await defaultStepSubmitHandler(
          step,
          body,
          getCreateCompanyClientFormConfig(t, onSuccessFn)
        );
        console.log("result before success", result);
        useFormStore.getState().setValues(formId, {
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
                useFormStore.getState().setValues(formId, {
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
    // editDataTransformer: (data) => {},
    onSuccess: onSuccessFn,
    submitButtonText: t("form.submitButtonText"),
    cancelButtonText: t("form.cancelButtonText"),
    showReset: false,
    resetButtonText: t("form.resetButtonText"),
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
