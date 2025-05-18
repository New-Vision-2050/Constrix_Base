import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { InvalidMessage } from "@/modules/companies/components/retrieve-data-via-mail/EmailExistDialog";
import { useTranslations } from "next-intl";
import PickupMap from "@/components/shared/pickup-map";

export function customerFormConfig(
  t: ReturnType<typeof useTranslations>
): FormConfig {
  const formId = `client-form-config`;
  const isCompany = (values: Record<string, string>) =>
    values["client_type"] === "company";
  const isIndividual = (values: Record<string, string>) =>
    values["client_type"] === "individual";
  return {
    formId,
    title: "اضافة عميل",
    apiUrl: `${baseURL}/write-url`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        collapsible: false,
        fields: [
          {
            type: "select",
            name: "client_type",
            label: "نوع العميل",
            placeholder: "نوع العميل",
            options: [
              { label: "فرد", value: "individual" },
              { label: "شركة", value: "company" },
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
            name: "client_name",
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
            name: "company_name",
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
                keysToUpdate={["latitude", "longitude"]}
                inGeneral={true}
              />
            ),
          },
          {
            label: "",
            name: "",
            type: "text",
            render: () => (
              <p className="text-xs">
                - يجب اختيار خطوط الطول و دوائر العرض من الخريطة
              </p>
            ),
          },
          {
            name: "latitude",
            label: "latitude",
            placeholder: "latitude",
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: "ادخل دائرة العرض",
              },
            ],
          },
          {
            name: "longitude",
            label: "longitude",
            placeholder: "longitude",
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: "ادخل خط الطول",
              },
            ],
          },
          {
            name: "company_representative",
            label: "اسم ممثل الشركة",
            type: "text",
            placeholder: "ادخل اسم ممثل الشركة",
            required: true,
            condition: (values) => isCompany(values),
            validation: [
              {
                type: "required",
                message: "اسم ممثل الشركة مطلوب",
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
            name: "commercial_number",
            label: " السجل التجاري",
            type: "text",
            placeholder: "ادخل السجل التجاري",
            required: true,
            condition: (values) => isCompany(values),
            validation: [
              {
                type: "required",
                message: "اسم السجل التجاري",
              },
            ],
          },
          {
            name: "identity",
            label: "رقم الهوية",
            type: "text",
            placeholder: "رقم الهوية",
            required: true,
            condition: (values) => isIndividual(values),
            validation: [
              {
                type: "required",
                message: "رقم الهوية مطلوب",
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
                message: <InvalidMessage formId={formId} />,
                apiConfig: {
                  url: `${baseURL}/company-users/check-email`,
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  successCondition: (response) => {
                    useFormStore.getState().setValues(formId, {
                      exist_user_id: response.payload?.[0]?.id,
                    });
                    useFormStore.getState().setValues(formId, {
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
            name: "company_field_id",
            label: "الفرع - ستاتيك",
            type: "select",
            isMulti: true,
            placeholder: "اختر الفرع",
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
                message: "برجاء اختيار الفرع",
              },
            ],
          },
          {
            type: "select",
            name: "broker",
            label: "الوسيط",
            placeholder: "الوسيط",
            dynamicOptions: {
              url: `${baseURL}/write-url`,
              valueField: "slug",
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
                message: "ادخل الوسيط",
              },
            ],
          },
          {
            name: "message_address",
            label: "عنوان المراسلات",
            type: "email",
            placeholder: "ادخل عنوان المراسلات",
            required: true,
            validation: [
              {
                type: "required",
                message: "عنوان المراسلات مطلوب",
              },
            ],
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
