// Define the form configuration
import React from "react";
import { baseURL } from "@/config/axios-config";
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { TimeZoneCheckbox } from "@/modules/form-builder/components/TimeZoneCheckbox";
import { defaultStepSubmitHandler } from "@/modules/form-builder/utils/defaultStepSubmitHandler";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export function getCreateCompanyClientFormConfig(
  t: (key: string) => string,
  onSuccessFn: () => void,
  currentEmpBranchId?: string,
  currentEmpId?: string,
  isShareClient?: boolean,
  companyBranchesIds?: string[],
  sub_entity_id?: string,
): FormConfig {
  const formId = "company-client-form";
  
  // Debounce timer for username generation
  let usernameGenerationTimer: NodeJS.Timeout | null = null;

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
            onChange: (newVal) => {
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
            onChange: (newVal, formValues) => {
              if (!newVal || typeof newVal !== 'string') return;
              
              // Clear previous timer
              if (usernameGenerationTimer) {
                clearTimeout(usernameGenerationTimer);
              }
              
              // Set new timer to generate username after user stops typing
              usernameGenerationTimer = setTimeout(async () => {
                // Check if username field already has a value - if so, don't regenerate
                const currentUsername = formValues?.user_name;
                if (currentUsername && currentUsername.trim() !== '') {
                  return; // Don't regenerate if username already exists
                }
                
                // Generate base username from Arabic name
                const generateUsername = (name: string): string => {
                  const translitMap: Record<string, string> = {
                    'ا': 'a', 'أ': 'a', 'إ': 'a', 'آ': 'a',
                    'ب': 'b', 'ت': 't', 'ث': 'th',
                    'ج': 'j', 'ح': 'h', 'خ': 'kh',
                    'د': 'd', 'ذ': 'dh', 'ر': 'r',
                    'ز': 'z', 'س': 's', 'ش': 'sh',
                    'ص': 's', 'ض': 'd', 'ط': 't',
                    'ظ': 'z', 'ع': 'a', 'غ': 'gh',
                    'ف': 'f', 'ق': 'q', 'ك': 'k',
                    'ل': 'l', 'م': 'm', 'ن': 'n',
                    'ه': 'h', 'و': 'w', 'ي': 'y',
                    'ى': 'a', 'ة': 'h', 'ئ': 'e',
                    'ؤ': 'o', ' ': '', '-': ''
                  };
                  
                  return name.split('').map(char => translitMap[char] || '').join('').toLowerCase();
                };
                
                // Generate unique username
                let baseUsername = generateUsername(newVal);
                if (!baseUsername) return; // Skip if transliteration resulted in empty string
                
                // Set the base username immediately for instant feedback
                useFormStore.getState().setValue(formId, "user_name", baseUsername);
                
                // Check username uniqueness via API
                const checkUsernameUnique = async (username: string): Promise<boolean> => {
                  try {
                    const response = await fetch(`${baseURL}/companies/validated`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ user_name: username })
                    });
                    const data = await response.json();
                    return data.payload?.status === 1;
                  } catch (error) {
                    console.error('Username validation error:', error);
                    return false;
                  }
                };
                
                // Validate and adjust if needed
                let finalUsername = baseUsername;
                const isUnique = await checkUsernameUnique(finalUsername);
                
                if (!isUnique) {
                  // Try with small numbers 1-9 first
                  let counter = 1;
                  let found = false;
                  
                  while (counter <= 9 && !found) {
                    finalUsername = `${baseUsername}${counter}`;
                    if (await checkUsernameUnique(finalUsername)) {
                      found = true;
                    } else {
                      counter++;
                    }
                  }
                  
                  // If still not unique after 1-9, use timestamp
                  if (!found) {
                    const timestamp = Date.now().toString().slice(-4);
                    finalUsername = `${baseUsername}${timestamp}`;
                  }
                  
                  // Update with the unique username
                  useFormStore.getState().setValue(formId, "user_name", finalUsername);
                }
              }, 300); // Wait 300ms after user stops typing
            },
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
                value: /^[a-zA-Z0-9]+$/,
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
              onChange: (value: boolean) => void,
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
          // company id (hidden field to store the company ID from step 1)
          {
            name: "company_id",
            label: "",
            type: "hiddenObject",
            defaultValue: "",
          },
          // Individual client select (user_id)
          {
            type: "select",
            name: "user_id",
            label: t("form.selectIndividualClient"),
            placeholder: t("form.selectIndividualClientPlaceholder"),
            required: true,
            dynamicOptions: {
              url: `${baseURL}/company-users/clients?type=1`, // type=1 for individual clients
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
                message: t("form.individualClientRequired"),
              },
            ],
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
        1: `${baseURL}/company-users/clients/company`,
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
        let body: any = { ...values, sub_entity_id };
        console.log("Breakpoint101 step,values ::", step, values);
        if (step === 1) {
          // Step 1: Link individual client to company
          body = {
            user_id: (values as any).user_id,
            company_id: (values as any).company_id,
            sub_entity_id,
          };
        }
        console.log("Breakpoint102 step,body ::", step, body);
        const result = await defaultStepSubmitHandler(
          step,
          { ...body, sub_entity_id },
          getCreateCompanyClientFormConfig(t, onSuccessFn),
        );
        
        // Store company_id from step 0 for use in step 1
        if (step === 0 && result?.data?.payload?.id) {
          useFormStore.getState().setValues(formId, {
            company_id: result.data.payload.id,
          });
        }
        
        if (result.success) {
          return new Promise((resolve) => {
            resolve({
              success: true,
              message: `Step ${step + 1} submitted successfully`,
              data: () => {
                console.log("result after success", result);
                return {
                  // For step 0 (company creation), return the generated ID
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
    onSubmit: async (formData) => {
      return await defaultSubmitHandler(
        {
          user_id: (formData as any).user_id,
          company_id: (formData as any).company_id,
          sub_entity_id,
        },
        getCreateCompanyClientFormConfig(t, onSuccessFn),
      );
    },
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
