import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import PickupMap from "@/components/shared/pickup-map";
import InvalidMailDialog from "@/modules/program-settings/components/InvalidMailDialog";
import { RetrieveClientFormConfig } from "@/modules/program-settings/users-settings/config/RetrieveClientFormConfig";
import { UsersTypes } from "@/modules/program-settings/constants/users-types";

export function customerFormConfig(
  t: ReturnType<typeof useTranslations>,
  handleCloseForm?: () => void
): FormConfig {
  const formId = `client-form-config`;
  const isCompany = (values: Record<string, string>) => values["type"] === "2";
  const isIndividual = (values: Record<string, string>) =>
    values["type"] === "1";

  return {
    formId,
    title: "اضافة",
    apiUrl: `${baseURL}/company-users/clients`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
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
            name: "user_id",
            label: "user_id",
            type: "hiddenObject",
          },
          {
            type: "select",
            name: "type",
            label: "نوع العميل",
            placeholder: "نوع العميل",
            options: [
              { label: "فرد", value: "1" },
              { label: "شركة", value: "2" },
            ],
            required: true,
            validation: [
              {
                type: "required",
                message: "ادخل نوع العميل",
              },
            ],
          },
          {
            name: "name",
            label: "اسم العميل",
            type: "text",
            placeholder: "ادخل اسم العميل",
            required: true,
            condition: (values) => isIndividual(values),
            validation: [
              {
                type: "required",
                message: "اسم العميل مطلوب",
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicFirstName"),
              },
              {
                type: "minLength",
                value: 2,
                message: "الاسم يجب أن يحتوي على حرفين على الأقل.",
              },
            ],
          },
          {
            name: "name",
            label: "اسم الشركة",
            type: "text",
            placeholder: "ادخل اسم الشركة",
            required: true,
            condition: (values) => isCompany(values),
            validation: [
              {
                type: "required",
                message: "اسم الشركة مطلوب",
              },
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicFirstName"),
              },
              {
                type: "minLength",
                value: 2,
                message: "الاسم يجب أن يحتوي على حرفين على الأقل.",
              },
            ],
          },
          {
            label: "تعديل الموقع من الخريطة",
            name: "map",
            type: "text",
            render: () => (
              <PickupMap
                formId={formId}
                keysToUpdate={[
                  "latitude",
                  "longitude",
                  "country_id",
                  "state_id",
                  "city_id",
                  "neighborhood_name",
                  "postal_code",
                  "street_name",
                ]}
                inGeneral={true}
              />
            ),
          },
          {
            name: "latitude",
            label: "latitude",
            placeholder: "latitude",
            type: "hiddenObject",
          },
          {
            name: "longitude",
            label: "longitude",
            placeholder: "longitude",
            type: "hiddenObject",
          },
          {
            type: "select",
            name: "country_id",
            label: "الدولة",
            placeholder: "الدولة",
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
            condition: (values) => !!values["country_id"],
          },
          {
            type: "select",
            name: "state_id",
            label: "المنطقة",
            placeholder: "المنطقة",
            dynamicOptions: {
              url: `${baseURL}/countries/get-country-states-cities`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "country_id",
              filterParam: "country_id",
            },
            condition: (values) => !!values["country_id"],
          },
          {
            type: "select",
            name: "city_id",
            label: "المدينة",
            placeholder: "المدينة",
            dynamicOptions: {
              url: `${baseURL}/countries/get-country-states-cities`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "state_id",
              filterParam: "state_id",
            },
            condition: (values) => !!values["country_id"],
          },
          {
            name: "neighborhood_name",
            label: "الحي",
            type: "text",
            placeholder: "الحي",
            condition: (values) => !!values["country_id"],
          },
          {
            name: "building_number",
            label: "رقم المبنى",
            type: "text",
            placeholder: "رقم المبنى",
            condition: (values) => !!values["country_id"],
          },
          {
            name: "additional_phone",
            label: "الرقم الاضافي",
            type: "phone",
            placeholder: "الرقم الاضافي",
            condition: (values) => !!values["country_id"],
          },
          {
            name: "postal_code",
            label: "الرمز البريدي",
            type: "text",
            placeholder: "الرمز البريدي",
            condition: (values) => !!values["country_id"],
          },
          {
            name: "street_name",
            label: "الشارع",
            type: "text",
            placeholder: "الشارع",
            condition: (values) => !!values["country_id"],
          },
          {
            name: "company_representative_name",
            label: "اسم ممثل الشركة",
            type: "text",
            placeholder: "ادخل اسم ممثل الشركة",
            condition: (values) => isCompany(values),
            validation: [
              {
                type: "pattern",
                value: /^[\p{Script=Arabic}\s]+$/u,
                message: t("Validation.arabicFirstName"),
              },
              {
                type: "minLength",
                value: 2,
                message: "الاسم يجب أن يحتوي على حرفين على الأقل.",
              },
            ],
          },
          {
            name: "registration_number",
            label: " السجل التجاري",
            type: "text",
            placeholder: "ادخل السجل التجاري",
            condition: (values) => isCompany(values),
          },
          {
            name: "residence",
            label: "رقم الهوية",
            type: "text",
            placeholder: "رقم الهوية",
            condition: (values) => isIndividual(values),
            validation: [
              {
                type: "required",
                message: "رقم الهوية مطلوب",
              },
              {
                type: "pattern",
                value: /^[12]\d{9}$/,
                message:
                  "رقم الهوية يجب أن يتكون من 10 أرقام ويبدأ بالرقم 1 أو 2",
              },
              {
                type: "minLength",
                value: 10,
                message: "رقم الهوية يجب أن يتكون من 10 أرقام",
              },
              {
                type: "maxLength",
                value: 10,
                message: "رقم الهوية يجب أن يتكون من 10 أرقام",
              },
              {
                type: "pattern",
                value: /^\d+$/,
                message: "رقم الهوية يجب أن يحتوي على أرقام فقط",
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
                message: "يرجى إدخال عنوان بريد إلكتروني صالح.",
              },
              {
                type: "apiValidation",
                message: (
                  <InvalidMailDialog
                    formId={formId}
                    btnText="أضغط هنا"
                    dialogStatement="البريد الإلكتروني أدناه مضاف مسبقًا"
                    onSuccess={() => {
                      handleCloseForm?.();
                    }}
                    currentRole={UsersTypes.Client}
                    formConfig={RetrieveClientFormConfig}
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
            required: true,
            placeholder: "يرجى إدخال رقم هاتفك.",
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },
          {
            name: "branch_ids",
            label: "الفروع",
            type: "select",
            isMulti: true,
            placeholder: "اختر الفروع",
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
          },
          {
            type: "select",
            name: "broker_id",
            label: "الوسيط",
            placeholder: "الوسيط",
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
          {
            name: "message_address",
            label: "عنوان المراسلات",
            type: "email",
            placeholder: "ادخل عنوان المراسلات",
          },
        ],
      },
    ],
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
