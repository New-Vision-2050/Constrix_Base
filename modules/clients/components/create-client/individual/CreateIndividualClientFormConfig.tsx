// Define the form configuration
import React from "react";
import { useTranslations } from "next-intl";
import { baseURL } from "@/config/axios-config";
import InvalidClientMailDialog from "./InvalidClientMailDialog";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import AddressDialog from "./AddressDialog";

export function getCreateIndividualClientFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void,
  currentEmpBranchId?: string,
  currentEmpId?: string,
  isShareClient?: boolean,
  companyBranchesIds?: string[]
): FormConfig {
  const formId = "individual-client-form";

  console.log("isShareClient", isShareClient, companyBranchesIds);

  return {
    formId,
    title: t("form.title"),
    apiUrl: `${baseURL}/company-users/clients`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    // initialValues: {
    //   branch_ids: companyBranchesIds ?? [],
    // },
    sections: [
      {
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
            defaultValue: "1",
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
                    // reset preventRetriveUserData
                    useFormStore.getState().setValues(formId, {
                      preventRetriveUserData: true,
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
            name: "name",
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
