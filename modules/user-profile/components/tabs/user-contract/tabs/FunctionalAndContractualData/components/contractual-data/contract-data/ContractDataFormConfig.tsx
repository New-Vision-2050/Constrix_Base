import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFunctionalContractualCxt } from "../../../context";
import { Contract } from "@/modules/user-profile/types/Contract";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";

type PropsT = {
  contract?: Contract;
};

export const ContractDataFormConfig = ({ contract }: PropsT) => {
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchContractData } = useFunctionalContractualCxt();

  const contractDataFormConfig: FormConfig = {
    formId: `user-contract-data-form-${contract?.id}`,
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
            name: "contract_duration",
            label: "مدة العقد",
            type: "text",
            placeholder: "مدة العقد",
            validation: [
              {
                type: "required",
                message: "مدة العقد مطلوب",
              },
            ],
          },
          {
            name: "notice_period",
            label: "فترة الاشعار",
            type: "text",
            placeholder: "فترة الاشعار",
            validation: [
              {
                type: "required",
                message: "فترة الاشعار مطلوب",
              },
            ],
          },
          {
            name: "probation_period",
            label: "فترة التجربة",
            type: "text",
            placeholder: "فترة التجربة",
            validation: [
              {
                type: "required",
                message: "فترة التجربة مطلوب",
              },
            ],
          },
          {
            name: "nature_work",
            label: "طبيعة العمل",
            type: "text",
            placeholder: "طبيعة العمل",
            validation: [
              {
                type: "required",
                message: "طبيعة العمل مطلوب",
              },
            ],
          },
          {
            name: "type_working_hours",
            label: "نوع ساعات العمل",
            type: "text",
            placeholder: "نوع ساعات العمل",
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
            name: "right_terminate",
            label: "حق الانهاء خلال فترة التجربة",
            type: "text",
            placeholder: "حق الانهاء خلال فترة التجربة",
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
            type: "image",
            placeholder: "ارفاق العقد",
          },
        ],
      },
    ],
    initialValues: {
      contract_number: contract?.contract_number,
      start_date: contract?.start_date,
      commencement_date: contract?.commencement_date,
      contract_duration: contract?.contract_duration,
      notice_period: contract?.notice_period,
      probation_period: contract?.probation_period,
      nature_work: contract?.nature_work,
      type_working_hours: contract?.type_working_hours,
      working_hours: contract?.working_hours,
      annual_leave: contract?.annual_leave,
      country_id: contract?.country_id,
      right_terminate: contract?.right_terminate,
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
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

      const response = await apiClient.post(
        `/employment_contracts`,
        serialize(body)
      );

      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return contractDataFormConfig;
};
