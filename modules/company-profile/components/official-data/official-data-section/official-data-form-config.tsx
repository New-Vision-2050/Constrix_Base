import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import useCompanyStore from "../../../store/useCompanyOfficialData";

export const CompanyOfficialData = () => {
  const { company } = useCompanyStore();
  const PersonalFormConfig: FormConfig = {
    formId: "company-official-data-form",
    apiUrl: `${baseURL}/companies/company-profile/official-data`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        columns: 2,
        fields: [
          {
            name: "name",
            label: "اسم الشركة",
            type: "text",
            placeholder: "اسم الشركة",
            disabled: true,
          },
          {
            name: "branch_name",
            label: "اسم الفرع",
            type: "text",
            placeholder: "اسم الفرع",
            validation: [
              {
                type: "required",
                message: "اسم الفرع مطلوب",
              },
            ],
          },
          {
            name: "name_en",
            label: "اسم الشركة بالانجليزي",
            type: "text",
            placeholder: "يجب كتابة الاسم باللغة الانجليزية",
            validation: [
              {
                type: "required",
                message: "اسم الشركة مطلوب",
              },
            ],
            gridArea: 2,
          },
          {
            name: "company_type",
            label: "كيان الشركة",
            type: "text",
            placeholder: "كيان الشركة",
            disabled: true,
          },
          {
            name: "country",
            label: "دولة المركز الرئيسي",
            type: "text",
            placeholder: "دولة المركز الرئيسي",
            disabled: true,
          },
          {
            name: "company_field",
            label: "مجال الشركة",
            type: "text",
            placeholder: "مجال الشركة",
            disabled: true,
          },
          {
            name: "phone",
            label: "رقم الجوال",
            type: "text",
            placeholder: "رقم الجوال",
            validation: [
              {
                type: "required",
                message: "رقم الجوال مطلوب",
              },
            ],
          },
          {
            name: "email",
            label: "البريد الالكتروني",
            type: "text",
            placeholder: "البريد الالكتروني",
            validation: [
              {
                type: "required",
                message: "البريد الالكتروني مطلوب",
              },
            ],
          },
          {
            name: "bucket",
            label: "الباقة",
            type: "text",
            placeholder: "الباقة",
            disabled: true,
          },
        ],
      },
    ],
    initialValues: {
      name: company?.name ?? "",
      branch_name: company?.main_branch?.name ?? "",
      name_en: company?.name_en ?? "",
      company_type: company?.company_type ?? "",
      country: company?.country_id ?? "",
      company_field: company?.company_field ?? "",
      phone: company?.phone ?? "",
      email: company?.email ?? "",
      bucket: "متميز",
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
  };
  return PersonalFormConfig;
};
