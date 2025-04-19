import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import useCompanyStore from "../../../store/useCompanyOfficialData";

export const addNewBranchFormConfig = () => {
  const { company } = useCompanyStore();
  const addNewBranchFormConfig: FormConfig = {
    formId: "company-official-data-form",
    apiUrl: `${baseURL}/write-ur-url`,
    title: "اضافة فرع جديد",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
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
            validation: [
              {
                type: "required",
                message: "الدولة",
              },
            ],
          },
          {
            name: "branch_name",
            label: "اسم الفرع",
            type: "select",
            options: [{ label: "فرع الرياض", value: "فرع الرياض" }],
            validation: [
              {
                type: "required",
                message: "ادخل اسم الفرع",
              },
            ],
          },
          {
            name: "government",
            label: "المحافظة",
            type: "select",
            options: [{ label: "الشمالية", value: "الشمالية" }],
            validation: [
              {
                type: "required",
                message: "ادخل المحافظة",
              },
            ],
          },
          {
            name: "branch_type",
            label: "نوع الفرع",
            type: "select",
            options: [{ label: "رئيسي", value: "رئيسي" }],
            validation: [
              {
                type: "required",
                message: "ادخل نوع الفرع",
              },
            ],
          },
          {
            name: "branch_manager",
            label: "مدير الفرع",
            type: "select",
            options: [{ label: "سعد مشعل", value: "سعد مشعل" }],
            validation: [
              {
                type: "required",
                message: "ادخل مدير الفرع",
              },
            ],
          },
          {
            name: "phone",
            label: "رقم الجوال",
            type: "phone",
            validation: [
              {
                type: "required",
                message: "ادخل رقم الجوال",
              },
            ],
          },
          {
            name: "email",
            label: "البريد الالكتروني",
            type: "email",
            validation: [
              {
                type: "required",
                message: "ادخل البريد الالكتروني",
              },
              {
                type: "email",
                message: "البريد الالكتروني غير صحيح",
              },
            ],
          },
        ],
      },
    ],
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
  };
  return addNewBranchFormConfig;
};
