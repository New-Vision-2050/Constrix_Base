import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFunctionalContractualCxt } from "../../../context";
import { Contract } from "@/modules/user-profile/types/Contract";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

type PropsT = {
  contract?: Contract;
};

export const ContractDataFormConfig = ({ contract }: PropsT) => {
  const { user, handleRefetchDataStatus, handleRefetchWidgetData } =
    useUserProfileCxt();
  const { handleRefetchContractData, timeUnits } =
    useFunctionalContractualCxt();

  const contractDataFormConfig: FormConfig = {
    formId: `user-contract-data-form-${contract?.id}`,
    apiUrl: `${baseURL}/employment_contracts`,
    sections: [
      {
        fields: [
          {
            name: "contract_number",
            label: "رقم العقد",
            type: "text",
            placeholder: "رقم العقد",
            validation: [
              {
                type: "required",
                message: "رقم العقد مطلوب",
              },
            ],
          },
          {
            name: "start_date",
            label: "تاريخ المباشرة",
            type: "date",
            placeholder: "تاريخ المباشرة",
            validation: [
              {
                type: "required",
                message: "تاريخ المباشرة مطلوب",
              },
            ],
          },
          {
            name: "commencement_date",
            label: "تاريخ البدء",
            type: "date",
            placeholder: "تاريخ البدء",
            validation: [
              {
                type: "required",
                message: "تاريخ البدء مطلوب",
              },
            ],
          },
          {
            name: "contract_duration_unit",
            label: "contract_duration_unit",
            placeholder: "contract_duration_unit",
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: "contract duration time unit required",
              },
            ],
          },
          {
            name: "contract_duration",
            label: "مدة العقد",
            type: "text",
            placeholder: "مدة العقد",
            postfix: (
              <div className="w-full h-full">
                <select
                  className="rounded-lg p-2 bg-transparent"
                  defaultValue={contract?.contract_duration_unit?.id}
                  onChange={(e) => {
                    useFormStore
                      .getState()
                      .setValues(`user-contract-data-form-${contract?.id}`, {
                        contract_duration_unit: e.target.value,
                      });
                  }}
                >
                  {timeUnits?.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="bg-sidebar text-black dark:text-white"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ),
            validation: [
              {
                type: "required",
                message: "مدة العقد مطلوب",
              },
            ],
          },
          {
            name: "notice_period_unit",
            label: "notice_period_unit",
            placeholder: "notice_period_unit",
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: "ادخل دائرة العرض",
              },
            ],
          },
          {
            name: "notice_period",
            label: "فترة الاشعار",
            type: "text",
            placeholder: "فترة الاشعار",
            postfix: (
              <div className="w-full h-full">
                <select
                  className="rounded-lg p-2 bg-transparent"
                  defaultValue={contract?.notice_period_unit?.id}
                  onChange={(e) => {
                    useFormStore
                      .getState()
                      .setValues(`user-contract-data-form-${contract?.id}`, {
                        notice_period_unit: e.target.value,
                      });
                  }}
                >
                  {timeUnits?.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="bg-sidebar text-black dark:text-white"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ),
            validation: [
              {
                type: "required",
                message: "فترة الاشعار مطلوب",
              },
            ],
          },
          {
            name: "probation_period_unit",
            label: "probation_period_unit",
            placeholder: "probation_period_unit",
            type: "hiddenObject",
            validation: [
              {
                type: "required",
                message: "ادخل دائرة العرض",
              },
            ],
          },
          {
            name: "probation_period",
            label: "فترة التجربة",
            type: "text",
            placeholder: "فترة التجربة",
            postfix: (
              <div className="w-full h-full">
                <select
                  className="rounded-lg p-2 bg-transparent"
                  defaultValue={contract?.probation_period_unit?.id}
                  onChange={(e) => {
                    useFormStore
                      .getState()
                      .setValues(`user-contract-data-form-${contract?.id}`, {
                        probation_period_unit: e.target.value,
                      });
                  }}
                >
                  {timeUnits?.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      className="bg-sidebar text-black dark:text-white"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ),
            validation: [
              {
                type: "required",
                message: "فترة التجربة مطلوب",
              },
            ],
          },
          {
            name: "nature_work_id",
            label: "طبيعة العمل",
            type: "select",
            placeholder: "طبيعة العمل",
            dynamicOptions: {
              url: `${baseURL}/nature_works`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",

              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "طبيعة العمل مطلوب",
              },
            ],
          },
          {
            name: "type_working_hour_id",
            label: "نوع ساعات العمل",
            type: "select",
            placeholder: "نوع ساعات العمل",
            dynamicOptions: {
              url: `${baseURL}/type_working_hours`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",

              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "نوع ساعات العمل مطلوب",
              },
            ],
          },
          {
            name: "working_hours",
            label: "ساعات العمل الاسبوعية",
            type: "text",
            placeholder: "ساعات العمل الاسبوعية",
            postfix: "ساعة",
            validation: [
              {
                type: "required",
                message: "ساعات العمل الاسبوعية مطلوب",
              },
            ],
          },
          {
            name: "annual_leave",
            label: "ايام الاجازات السنوية",
            type: "text",
            placeholder: "ايام الاجازات السنوية",
            postfix: "ايام",
            validation: [
              {
                type: "required",
                message: "ايام الاجازات السنوية مطلوب",
              },
            ],
          },
          {
            type: "select",
            name: "country_id",
            label: "مكان العمل",
            placeholder: "اختر مكان العمل",
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
            validation: [
              {
                type: "required",
                message: "ادخل مكان العمل",
              },
            ],
          },
          {
            name: "right_terminate_id",
            label: "حق الانهاء خلال فترة التجربة",
            type: "select",
            placeholder: "حق الانهاء خلال فترة التجربة",
            dynamicOptions: {
              url: `${baseURL}/right_terminates`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",

              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: "حق الانهاء خلال فترة التجربة مطلوب",
              },
            ],
          },
          {
            name: "file",
            label: "ارفاق العقد",
            type: "file",
            placeholder: "ارفاق العقد",
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      annual_leave: contract?.annual_leave,
      contract_number: contract?.contract_number,
      start_date: contract?.start_date,
      commencement_date: contract?.commencement_date,
      contract_duration: contract?.contract_duration,
      notice_period: contract?.notice_period,
      probation_period: contract?.probation_period,
      nature_work_id: contract?.nature_work?.id,
      type_working_hour_id: contract?.type_working_hour?.id,
      working_hours: contract?.working_hours,
      country_id: contract?.country_id,
      right_terminate_id: contract?.right_terminate?.id,
      notice_period_unit:
        contract?.notice_period_unit?.id || timeUnits?.[0]?.id,
      contract_duration_unit:
        contract?.contract_duration_unit?.id || timeUnits?.[0]?.id,
      probation_period_unit:
        contract?.probation_period_unit?.id || timeUnits?.[0]?.id,
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchWidgetData();
      handleRefetchDataStatus();
      handleRefetchContractData();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const startDate = new Date(formData?.start_date as string);
      const commencementDate = new Date(formData?.commencement_date as string);

      const body = {
        ...formData,
        user_id: user?.user_id,
        start_date: formatDateYYYYMMDD(startDate),
        commencement_date: formatDateYYYYMMDD(commencementDate),
      };

      return await defaultSubmitHandler(
        serialize(body),
        contractDataFormConfig
      );
    },
  };
  return contractDataFormConfig;
};
