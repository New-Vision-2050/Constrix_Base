import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { Branch } from "@/modules/company-profile/types/company";
import PickupMap from "../../official-data/national-address/pickup-map";
import { useQueryClient } from "@tanstack/react-query";

export const addNewBranchFormConfig = (branches: Branch[]) => {
  const queryClient = useQueryClient();
  const formId = "add-new-branch-form";
  const addNewBranchFormConfig: FormConfig = {
    formId,
    apiUrl: `${baseURL}/management_hierarchies/create-branch`,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["main-company-data"],
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
            type: "select",
            name: "state_id",
            label: "المحافظة",
            placeholder: "المحافظة",
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
            validation: [
              {
                type: "required",
                message: "ادخل المدينة",
              },
            ],
          },
          {
            name: "parent_id",
            label: "الفرع الرئيسي",
            type: "select",
            options: branches
              .filter((branch) => !branch.parent_id)
              .map((branch) => ({
                value: branch.id,
                label: branch.name,
              })),
            validation: [
              {
                type: "required",
                message: "ادخل نوع الفرع",
              },
            ],
          },
          {
            type: "select",
            name: "manager_id",
            label: "مدير الفرع",
            placeholder: "اختر مدير الفرع",
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
            required:true,
            validation: [
            {
                type: "phone",
                message: "",
            },
            ],
          },
          {
            name: "email",
            label: "البريد الالكتروني",
            type: "email",
            placeholder: "البريد الالكتروني",
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
