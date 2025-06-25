import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Branch } from "@/modules/company-profile/types/company";
import PickupMap from "../../../../../components/shared/pickup-map";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "next/navigation";

export const addNewBranchFormConfig = (branches: Branch[]) => {
  const { company_id }: { company_id: string | undefined } = useParams();

  const mainBranch = branches.find((branch) => !Boolean(branch.parent_id));

  const queryClient = useQueryClient();
  const formId = `add-new-branch-form-${company_id}`;
  const addNewBranchFormConfig: FormConfig = {
    formId,
    apiUrl: `${baseURL}/management_hierarchies/create-branch`,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["main-company-data", undefined, company_id],
      });
    },
    title: "اضافة فرع جديد",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "name",
            label: "اسم الفرع",
            placeholder: "اسم الفرع",
            type: "text",
            validation: [
              {
                type: "required",
                message: "ادخل اسم الفرع",
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
                  "country_id",
                  "state_id",
                  "city_id",
                  "latitude",
                  "longitude",
                ]}
                inGeneral={true}
              />
            ),
          },
          // {
          //   label: "",
          //   name: "",
          //   type: "text",
          //     render: () => (
          //         <p className="text-xs text-red-500">
          //             - يجب اختيار خطوط الطول و دوائر العرض من الخريطة
          //         </p>
          //     ),
          // },
          {
            type: "select",
            name: "country_id",
            label: "الدولة",
            placeholder: "الدولة",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/countries`,
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
                message: "الدولة",
              },
            ],
          },
          {
            type: "select",
            name: "state_id",
            label: "المحافظة",
            placeholder: "المحافظة",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/countries/get-country-states-cities`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
              dependsOn: "country_id",
              filterParam: "country_id",
            },
            validation: [
              {
                type: "required",
                message: "ادخل المنطقة",
              },
            ],
          },
          {
            type: "select",
            name: "city_id",
            label: "المدينة",
            placeholder: "المدينة",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/countries/get-country-states-cities`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 1000,
              totalCountHeader: "X-Total-Count",
              dependsOn: "state_id",
              filterParam: "state_id",
            },
            validation: [
              {
                type: "required",
                message: "ادخل المدينة",
              },
            ],
          },
          {
            name: "parent_name",
            label: "الفرع الرئيسي",
            type: "text",
            disabled: true,
          },
          {
            type: "select",
            name: "manager_id",
            label: "مدير الفرع",
            placeholder: "اختر مدير الفرع",
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
                message: "مدير الفرع",
              },
            ],
          },
          {
            name: "phone",
            label: "رقم الجوال",
            type: "phone",
            required: true,
            validation: [
              {
                type: "phone",
                message: "",
              },
            ],
          },
          {
            name: "email",
            label: "البريد الإلكتروني",
            type: "email",
            placeholder: "البريد الالكتروني",
            required: true,
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
          {
            name: "latitude",
            label: "latitude",
            placeholder: "latitude",
            type: "hiddenObject",
            // validation: [
            //   {
            //     type: "required",
            //     message: "ادخل دائرة العرض",
            //   },
            // ],
          },
          {
            name: "longitude",
            label: "longitude",
            placeholder: "longitude",
            type: "hiddenObject",
            // validation: [
            //   {
            //     type: "required",
            //     message: "ادخل خط الطول",
            //   },
            // ],
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
    initialValues: {
      parent_id: mainBranch?.id ?? "",
      parent_name: mainBranch?.name ?? "",
    },
    onSubmit: async (formData) => {
      console.log("formData", formData);
      return await defaultSubmitHandler(formData, addNewBranchFormConfig, {
        url: `${baseURL}/management_hierarchies/create-branch`,
        config: {
          params: {
            ...(company_id && { company_id }),
          },
        },
      });
    },
  };
  return addNewBranchFormConfig;
};
