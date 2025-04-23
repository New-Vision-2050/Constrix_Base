// Define the form configuration
import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { defaultStepSubmitHandler } from "@/modules/form-builder/utils/defaultStepSubmitHandler";
import { TimeZoneCheckbox } from "../components/TimeZoneCheckbox";
import { InvalidMessage } from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";

export const companiesFormConfig: FormConfig = {
  formId: "companies-form",
  title: "اضافة شركة جديدة",
  apiUrl: `${baseURL}/companies`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors", // This is the default in Laravel
  },
  sections: [
    {
      title: "إنشاء شركة",
      fields: [
        {
          type: "select",
          name: "country_id",
          label: "دولة الشركة",
          placeholder: "اختر دولة الشركة",
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
            console.log("neeeewValue", newVal, values);
            // useFormStore.getState().setValues("change-local-time-form", {
            //   "country-id": newVal,
            // });
          },
          validation: [
            {
              type: "required",
              message: "ادخل دولة الشركة",
            },
          ],
        },
        {
          name: "company_field_id",
          label: "النشاط",
          type: "select",
          isMulti: true,
          placeholder: "اختر النشاط",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/company_fields`,
            valueField: "id",
            labelField: "name",
            searchParam: "name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 20,
            totalCountHeader: "X-Total-Count",
          },
          validation: [
            {
              type: "required",
              message: "برجاء اختيار النشاط",
            },
          ],
        },
        {
          name: "name",
          label: "الاسم التجاري",
          type: "text",
          placeholder: "برجاء إدخال الاسم التجاري",
          validation: [
            {
              type: "required",
              message: "الاسم التجاري مطلوب",
            },
            {
              type: "apiValidation",
              message: "الاسم يجب ان يكون باللغة العربية ولا يتخلله رموز",
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
          label: "الاسم المختصر",
          type: "text",
          placeholder: "برجاء إدخال الاسم المختصر",
          postfix: "constrix.com",
          containerClassName: "rtl:flex-row-reverse",
          validation: [
            {
              type: "required",
              message: "الاسم المختصر مطلوب",
            },
            {
              type: "apiValidation",
              message: "This username is already taken",
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
          label: "مسؤول الدعم",
          placeholder: "اختر مسؤول الدعم",
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
              message: "مسؤول الدعم",
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
          validation: [
            {
              type: "custom",
              message: "Order must have at least one item",
              validator: (value) => {
                console.log("checkbox error: -----: ", value);

                return false;
              },
            },
          ],
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
      title: "إنشاء مستخدم",
      collapsible: false,
      fields: [
        {
          type: "hiddenObject",
          name: "exist_user_id",
          label: "exist_user_id",
          defaultValue: "",
        },
        {
          type: "text",
          name: "company_id",
          label: "الشركة",
          placeholder: "اختر الشركة",
          required: true,
          disabled: true,
          hidden: true,
          validation: [
            {
              type: "required",
              message: "اختر الشركة",
            },
          ],
        },
        {
          name: "first_name",
          label: "اسم المستخدم الاول",
          type: "text",
          placeholder: "ادخل اسم المستخدم الاول",
          required: true,
          validation: [
            {
              type: "required",
              message: "اسم المستخدم الاول مطلوب",
            },
            {
              type: "minLength",
              value: 2,
              message: "Name must be at least 2 characters",
            },
          ],
        },
        {
          name: "last_name",
          label: "اسم المستخدم ألأحير",
          type: "text",
          placeholder: "اسم المستخدم ألأحير",
          required: true,
          validation: [
            {
              type: "required",
              message: "الاسم مطلوب",
            },
            {
              type: "minLength",
              value: 2,
              message: "Name must be at least 2 characters",
            },
          ],
        },
        {
          name: "email",
          label: "البريد الإلكتروني",
          type: "email",
          placeholder: "ادخل البريد الإلكتروني",
          required: true,
          validation: [
            {
              type: "required",
              message: "البريد الإلكتروني مطلوب",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
            {
              type: "apiValidation",
              message: (
                <>
                  <InvalidMessage />
                </>
              ),
              apiConfig: {
                url: `${baseURL}/company-users/check-email`,
                method: "POST",
                debounceMs: 500,
                paramName: "email",
                successCondition: (response) => {
                  useFormStore.getState().setValues("companies-form", {
                    exist_user_id: response.payload?.[0]?.id,
                  });
                  return response.payload?.[0]?.status === 1;
                },
              },
            },
          ],
        },
        {
          name: "phone",
          label: "الهاتف",
          type: "phone",
          placeholder: "Enter your phone",
          validation: [
            {
              type: "required",
              message: "برجاء إدخال رقم الهاتف",
            },
          ],
        },
        {
          type: "select",
          name: "job_title_id",
          disabled: true,
          defaultValue: "8326ca2c-a0ea-443d-a073-4b16f21a3302",
          label: "المسمى الوظيفي",
          placeholder: "اختر المسمى الوظيفي",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/job_titles`,
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
              message: "المسمى الوظيفي",
            },
          ],
        },
      ],
    },
  ],
  initialValues: {
    job_title_id: "8326ca2c-a0ea-443d-a073-4b16f21a3302",
  },
  submitButtonText: "Send Message",
  cancelButtonText: "Cancel",
  showReset: false,
  resetButtonText: "Clear Form",
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
    nextButtonText: "Continue",
    prevButtonText: "Back",
    finishButtonText: "حفظ",
    // Enable submitting each step individually
    submitEachStep: true,
    submitButtonTextPerStep: "التالي",
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
        companiesFormConfig
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
    if (!Array.isArray(data.company_field_id)) {
      data.company_field_id = data?.company_field_id?.split(",");
    }
    return data;
  },
};

export function GetCompaniesFormConfig() {

  return {
    formId: "companies-form",
    title: "اضافة شركة جديدة",
    apiUrl: `${baseURL}/companies`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        title: "إنشاء شركة",
        fields: [
          {
            type: "select",
            name: "country_id",
            label: "دولة الشركة",
            placeholder: "اختر دولة الشركة",
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
              // setCountryId(newVal as string);
              useFormStore.getState().setValues("change-local-time-form", {
                "country-id": newVal,
              });
            },
            validation: [
              {
                type: "required",
                message: "ادخل دولة الشركة",
              },
            ],
          },
          {
            name: "company_field_id",
            label: "النشاط",
            type: "select",
            isMulti: true,
            placeholder: "اختر النشاط",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/company_fields`,
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
                message: "برجاء اختيار النشاط",
              },
            ],
          },
          {
            name: "name",
            label: "الاسم التجاري",
            type: "text",
            placeholder: "برجاء إدخال الاسم التجاري",
            validation: [
              {
                type: "apiValidation",
                message: "This username is already taken",
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
            label: "الاسم المختصر",
            type: "text",
            placeholder: "برجاء إدخال الاسم المختصر",
            postfix: "constrix.com",
            containerClassName: "rtl:flex-row-reverse",
            validation: [
              {
                type: "apiValidation",
                message: "This username is already taken",
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
            label: "مسؤول الدعم",
            placeholder: "اختر مسؤول الدعم",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/users`,
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
                message: "مسؤول الدعم",
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
            validation: [
              {
                type: "custom",
                message: "Order must have at least one item",
                validator: (value) => {
                  console.log("checkbox error: -----: ", value);

                  return false;
                },
              },
            ],
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
        title: "إنشاء مستخدم",
        collapsible: false,
        fields: [
          {
            type: "hiddenObject",
            name: "exist_user_id",
            label: "exist_user_id",
            defaultValue: "",
          },
          {
            type: "text",
            name: "company_id",
            label: "الشركة",
            placeholder: "اختر الشركة",
            required: true,
            disabled: true,
            hidden: true,
            validation: [
              {
                type: "required",
                message: "الشركة",
              },
            ],
          },
          {
            name: "first_name",
            label: "اسم المستخدم الاول",
            type: "text",
            placeholder: "ادخل اسم المستخدم الاول",
            required: true,
            validation: [
              {
                type: "required",
                message: "اسم المستخدم الاول مطلوب",
              },
              {
                type: "minLength",
                value: 2,
                message: "Name must be at least 2 characters",
              },
            ],
          },
          {
            name: "last_name",
            label: "اسم المستخدم ألأحير",
            type: "text",
            placeholder: "اسم المستخدم ألأحير",
            required: true,
            validation: [
              {
                type: "required",
                message: "الاسم مطلوب",
              },
              {
                type: "minLength",
                value: 2,
                message: "Name must be at least 2 characters",
              },
            ],
          },
          {
            name: "email",
            label: "البريد الإلكتروني",
            type: "email",
            placeholder: "ادخل البريد الإلكتروني",
            required: true,
            validation: [
              {
                type: "required",
                message: "البريد الإلكتروني مطلوب",
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
              {
                type: "apiValidation",
                message: (
                  <>
                    <InvalidMessage />
                  </>
                ),
                apiConfig: {
                  url: `${baseURL}/company-users/check-email`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  successCondition: (response) => {
                    useFormStore.getState().setValues("companies-form", {
                      exist_user_id: response.payload?.[0]?.id,
                    });
                    return response.payload?.[0]?.status === 1;
                  },
                },
              },
            ],
          },
          {
            name: "phone",
            label: "الهاتف",
            type: "phone",
            placeholder: "Enter your phone",
            validation: [
              {
                type: "required",
                message: "برجاء إدخال رقم الهاتف",
              },
            ],
          },
          {
            type: "select",
            name: "job_title_id",
            disabled: true,
            defaultValue: "8326ca2c-a0ea-443d-a073-4b16f21a3302",
            label: "المسمى الوظيفي",
            placeholder: "اختر المسمى الوظيفي",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/job_titles`,
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
                message: "المسمى الوظيفي",
              },
            ],
          },
        ],
      },
    ],
    initialValues: {
      job_title_id: "8326ca2c-a0ea-443d-a073-4b16f21a3302",
    },
    submitButtonText: "Send Message",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
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
      nextButtonText: "Continue",
      prevButtonText: "Back",
      finishButtonText: "حفظ",
      // Enable submitting each step individually
      submitEachStep: true,
      submitButtonTextPerStep: "التالي",
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
          companiesFormConfig
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
      if (!Array.isArray(data.company_field_id)) {
        data.company_field_id = data?.company_field_id?.split(",");
      }
      return data;
    },
  };
}
