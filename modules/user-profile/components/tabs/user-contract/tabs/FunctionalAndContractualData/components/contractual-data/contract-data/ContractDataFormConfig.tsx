import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFunctionalContractualCxt } from "../../../context";
import { Contract } from "@/modules/user-profile/types/Contract";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { useTranslations } from "next-intl";

type PropsT = {
  contract?: Contract;
};


export const ContractDataFormConfig = ({ contract }: PropsT) => {
  const t = useTranslations("ContractData");
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchContractData } = useFunctionalContractualCxt();
  const contractDataFormConfig: FormConfig = {
    formId: `user-contract-data-form-${contract?.id}`,
    sections: [
      {
        fields: [
          {
            name: "contract_number",
            label: t("ContractNumber"),
            type: "text",
            placeholder: t("ContractNumber"),
            validation: [
              {
                type: "required",
                message: t("ContractNumberRequired"),
              },
            ],
          },
          {
            name: "start_date",
            label: t("CommencementDate"), // Assuming label should be CommencementDate
            type: "date",
            placeholder: t("CommencementDate"),
            validation: [
              {
                type: "required",
                message: t("CommencementDateRequired"),
              },
            ],
          },
          {
            name: "commencement_date",
            label: t("StartDate"),
            type: "date",
            placeholder: t("StartDate"),
            validation: [
              {
                type: "required",
                message: t("StartDateRequired"),
              },
            ],
          },
          {
            name: "contract_duration",
            label: t("ContractDuration"),
            type: "text",
            placeholder: t("ContractDuration"),
            validation: [
              {
                type: "required",
                message: t("ContractDurationRequired"),
              },
            ],
          },
          {
            name: "notice_period",
            label: t("NoticePeriod"),
            type: "text",
            placeholder: t("NoticePeriod"),
            validation: [
              {
                type: "required",
                message: t("NoticePeriodRequired"),
              },
            ],
          },
          {
            name: "probation_period",
            label: t("ProbationPeriod"),
            type: "text",
            placeholder: t("ProbationPeriod"),
            validation: [
              {
                type: "required",
                message: t("ProbationPeriodRequired"),
              },
            ],
          },
          {
            name: "nature_work",
            label: t("NatureOfWork"),
            type: "text",
            placeholder: t("NatureOfWork"),
            validation: [
              {
                type: "required",
                message: t("NatureOfWorkRequired"),
              },
            ],
          },
          {
            name: "type_working_hours",
            label: t("WorkingHoursType"),
            type: "text",
            placeholder: t("WorkingHoursType"),
            validation: [
              {
                type: "required",
                message: t("WorkingHoursTypeRequired"),
              },
            ],
          },
          {
            name: "working_hours",
            label: t("WeeklyWorkingHours"),
            type: "text",
            placeholder: t("WeeklyWorkingHours"),
            validation: [
              {
                type: "required",
                message: t("WeeklyWorkingHoursRequired"),
              },
            ],
          },
          {
            name: "annual_leave",
            label: t("AnnualLeaveDays"),
            type: "text",
            placeholder: t("AnnualLeaveDays"),
            validation: [
              {
                type: "required",
                message: t("AnnualLeaveDaysRequired"),
              },
            ],
          },
          {
            type: "select",
            name: "country_id",
            label: t("WorkLocation"),
            placeholder: t("SelectWorkLocation"),
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
                message: t("EnterWorkLocation"),
              },
            ],
          },
          {
            name: "right_terminate",
            label: t("RightToTerminateDuringProbation"),
            type: "text",
            placeholder: t("RightToTerminateDuringProbation"),
            validation: [
              {
                type: "required",
                message: t("RightToTerminateDuringProbationRequired"),
              },
            ],
          },
          {
            name: "file",
            label: t("AttachContract"),
            type: "image",
            placeholder: t("AttachContract"),
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
