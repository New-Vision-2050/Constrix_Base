import { FormConfig, useFormStore } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFunctionalContractualCxt } from "../../../context";
import { Contract } from "@/modules/user-profile/types/Contract";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

type PropsT = {
  contract?: Contract;
};

// Helper function to convert time units to days for comparison
const convertToDays = (
  value: number,
  unitId: string,
  timeUnits: any[] | undefined
) => {
  // Search for the unit in the time units array
  const unit = timeUnits?.find((unit) => unit.id === unitId);
  if (!unit) return value; // If unit not found, return value as is

  // Assume unit name contains key words for time units
  const unitName = unit.name.toLowerCase();

  // Convert value to days based on unit type
  if (unitName.includes("يوم") || unitName.includes("day")) {
    return value; // Value already in days
  } else if (unitName.includes("شهر") || unitName.includes("month")) {
    return value * 30; // Approximate month to 30 days
  } else if (unitName.includes("سنه") || unitName.includes("year")) {
    return value * 365; // Approximate year to 365 days
  } else if (unitName.includes("أسبوع") || unitName.includes("week")) {
    return value * 7; // Week equals 7 days
  }

  // If unit not recognized, return value as is
  return value;
};

export const ContractDataFormConfig = ({ contract }: PropsT) => {
  const { userId, handleRefetchDataStatus, handleRefetchWidgetData } =
    useUserProfileCxt();
  const { handleRefetchContractData, timeUnits } =
    useFunctionalContractualCxt();
  const t = useTranslations("UserProfile.tabs.financialData.workContract");

  const contractDataFormConfig: FormConfig = {
    formId: `user-contract-data-form-${contract?.id}`,
    apiUrl: `${baseURL}/employment_contracts`,
    sections: [
      {
        fields: [
          {
            name: "contract_number",
            label: t("contractNumberLabel"),
            type: "text",
            placeholder: t("contractNumberPlaceholder"),
            validation: [],
          },
          {
            name: "start_date",
            label: t("startDateLabel"),
            type: "date",
            placeholder: t("startDatePlaceholder"),
            maxDate: {
              formId: `user-contract-data-form-${contract?.id}`,
              field: "commencement_date",
            },
            validation: [],
          },
          {
            name: "commencement_date",
            label: t("commencementDateLabel"),
            type: "date",
            placeholder: t("commencementDatePlaceholder"),
            minDate: {
              formId: `user-contract-data-form-${contract?.id}`,
              field: "start_date",
            },
            validation: [],
          },
          {
            name: "contract_duration_unit",
            label: "contract_duration_unit",
            placeholder: "contract_duration_unit",
            type: "hiddenObject",
            validation: [],
          },
          {
            name: "contract_duration",
            label: t("contractDurationLabel"),
            type: "text",
            placeholder: t("contractDurationPlaceholder"),
            onChange: (
              newValue: any,
              values: Record<string, any>,
              formId?: string
            ) => {
              // Reset notice_period and probation_period when contract_duration changes
              if (!formId) return;

              const formStore = useFormStore.getState();
              formStore.setValues(formId, {
                // Keep the new contract duration value
                contract_duration: newValue,
                // Reset related fields
                notice_period: "",
                probation_period: "",
              });
              console.log("Contract duration changed, related fields reset");
            },
            postfix: (
              <div className="w-full h-full">
                <select
                  className="rounded-lg p-2 bg-transparent"
                  defaultValue={contract?.contract_duration_unit?.id}
                  onChange={(e) => {
                    const formStore = useFormStore.getState();

                    // Reset notice_period and probation_period when contract_duration_unit changes
                    formStore.setValues(
                      `user-contract-data-form-${contract?.id}`,
                      {
                        contract_duration_unit: e.target.value,
                        // Reset related fields
                        annual_leave: "",
                        notice_period: "",
                        probation_period: "",
                      }
                    );
                    // Get current form values
                    const currentFormValues = formStore.getValues(
                      `user-contract-data-form-${contract?.id}`
                    );
                    // Get form config to access validation rules
                    const formConfig = contractDataFormConfig;

                    // Find validation rules for each field
                    const contractDurationRules =
                      formConfig.sections[0].fields.find(
                        (f) => f.name === "contract_duration"
                      )?.validation || [];
                    const noticePeriodRules =
                      formConfig.sections[0].fields.find(
                        (f) => f.name === "notice_period"
                      )?.validation || [];
                    const probationPeriodRules =
                      formConfig.sections[0].fields.find(
                        (f) => f.name === "probation_period"
                      )?.validation || [];

                    // Trigger validation for contract_duration field and set appropriate status
                    const contractValid = formStore.validateField(
                      `user-contract-data-form-${contract?.id}`,
                      "contract_duration",
                      currentFormValues.contract_duration,
                      contractDurationRules,
                      currentFormValues
                    );

                    if (contractValid) {
                      // If validation is successful, no additional action needed
                      // because validateField will automatically clear errors on successful validation
                    }

                    // Also trigger validation for notice_period and probation_period to check cross-field validations
                    const noticeValid = formStore.validateField(
                      `user-contract-data-form-${contract?.id}`,
                      "notice_period",
                      currentFormValues.notice_period,
                      noticePeriodRules,
                      currentFormValues
                    );

                    // If validation is successful, there won't be any errors as validateField handles errors automatically

                    const probationValid = formStore.validateField(
                      `user-contract-data-form-${contract?.id}`,
                      "probation_period",
                      currentFormValues.probation_period,
                      probationPeriodRules,
                      currentFormValues
                    );

                    // إذا كان التحقق صحيحًا، فلن تكون هناك أخطاء لأن validateField يتعامل مع الأخطاء تلقائيًا
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
                type: "pattern",
                value: "^[0-9]+$",
                message: t("contractDurationPattern"),
              },
            ],
          },
          {
            name: "notice_period_unit",
            label: "notice_period_unit",
            placeholder: "notice_period_unit",
            type: "hiddenObject",
            validation: [],
          },
          {
            name: "notice_period",
            label: t("noticePeriodLabel"),
            type: "text",
            placeholder: t("noticePeriodPlaceholder"),
            postfix: (
              <div className="w-full h-full">
                <select
                  className="rounded-lg p-2 bg-transparent"
                  defaultValue={contract?.notice_period_unit?.id}
                  onChange={(e) => {
                    const formStore = useFormStore.getState();
                    formStore.setValues(
                      `user-contract-data-form-${contract?.id}`,
                      {
                        notice_period_unit: e.target.value,
                      }
                    );
                    // Get current form values
                    const currentFormValues = formStore.getValues(
                      `user-contract-data-form-${contract?.id}`
                    );
                    // Get form config to access validation rules
                    const formConfig = contractDataFormConfig;

                    // Find validation rules
                    const noticePeriodRules =
                      formConfig.sections[0].fields.find(
                        (f) => f.name === "notice_period"
                      )?.validation || [];

                    // Trigger validation for notice_period field
                    const noticeValid = formStore.validateField(
                      `user-contract-data-form-${contract?.id}`,
                      "notice_period",
                      currentFormValues.notice_period,
                      noticePeriodRules,
                      currentFormValues
                    );

                    // إذا كان التحقق صحيحًا، فلن تكون هناك أخطاء لأن validateField يتعامل مع الأخطاء تلقائيًا
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
                type: "pattern",
                value: "^[0-9]+$",
                message: t("noticePeriodPattern"),
              },
              {
                type: "custom",
                validator: (value: any, formValues?: Record<string, any>) => {
                  if (!formValues) return true;
                  if (!value) return true; // If no value is provided, no validation needed

                  const contractDuration = Number(
                    formValues.contract_duration || 0
                  );
                  const noticePeriod = Number(value || 0);
                  const contractUnit = formValues.contract_duration_unit;
                  const noticeUnit = formValues.notice_period_unit;

                  if (contractDuration === 0) return true; // If contract duration is zero or doesn't exist

                  // Convert values to days for standardized comparison
                  // Convert values to days for standardized comparison
                  const contractDurationInDays = convertToDays(
                    contractDuration,
                    contractUnit || "",
                    timeUnits
                  );
                  const noticePeriodInDays = convertToDays(
                    noticePeriod,
                    noticeUnit || "",
                    timeUnits
                  );
                  console.log(
                    "contractDurationInDays",
                    contractDurationInDays,
                    "noticePeriodInDays",
                    noticePeriodInDays,
                    "noticeUnit",
                    noticeUnit,
                    "contractUnit",
                    contractUnit,
                    "timeUnits",
                    timeUnits
                  );
                  return noticePeriodInDays <= contractDurationInDays;
                },
                message: t("noticePeriodValidation"),
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
            label: t("probationPeriodLabel"),
            type: "text",
            placeholder: t("probationPeriodPlaceholder"),
            postfix: (
              <div className="w-full h-full">
                <select
                  className="rounded-lg p-2 bg-transparent"
                  defaultValue={contract?.probation_period_unit?.id}
                  onChange={(e) => {
                    const formStore = useFormStore.getState();
                    formStore.setValues(
                      `user-contract-data-form-${contract?.id}`,
                      {
                        probation_period_unit: e.target.value,
                      }
                    );
                    // Get current form values
                    const currentFormValues = formStore.getValues(
                      `user-contract-data-form-${contract?.id}`
                    );
                    // Get form config to access validation rules
                    const formConfig = contractDataFormConfig;

                    // Find validation rules
                    const probationPeriodRules =
                      formConfig.sections[0].fields.find(
                        (f) => f.name === "probation_period"
                      )?.validation || [];

                    // Trigger validation for probation_period field
                    const probationValid = formStore.validateField(
                      `user-contract-data-form-${contract?.id}`,
                      "probation_period",
                      currentFormValues.probation_period,
                      probationPeriodRules,
                      currentFormValues
                    );

                    // إذا كان التحقق صحيحًا، فلن تكون هناك أخطاء لأن validateField يتعامل مع الأخطاء تلقائيًا
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
                type: "pattern",
                value: "^[0-9]+$",
                message: t("probationPeriodPattern"),
              },
              {
                type: "custom",
                validator: (value: any, formValues?: Record<string, any>) => {
                  if (!formValues) return true;
                  if (!value) return true; // If no value is provided, no validation needed

                  const contractDuration = Number(
                    formValues.contract_duration || 0
                  );
                  const probationPeriod = Number(value || 0);
                  const contractUnit = formValues.contract_duration_unit;
                  const probationUnit = formValues.probation_period_unit;

                  if (contractDuration === 0) return true; // If contract duration is zero or doesn't exist

                  // Convert values to days for standardized comparison
                  // Convert values to days for standardized comparison
                  const contractDurationInDays = convertToDays(
                    contractDuration,
                    contractUnit || "",
                    timeUnits
                  );
                  const probationPeriodInDays = convertToDays(
                    probationPeriod,
                    probationUnit || "",
                    timeUnits
                  );

                  return probationPeriodInDays <= contractDurationInDays;
                },
                message: t("probationPeriodValidation"),
              },
            ],
          },
          {
            name: "type_working_hour_id",
            label: t("typeWorkingHourLabel"),
            type: "select",
            placeholder: t("typeWorkingHourPlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/type_working_hours`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",

              totalCountHeader: "X-Total-Count",
            },
            validation: [],
          },
          {
            name: "working_hours",
            label: t("workingHoursLabel"),
            type: "text",
            placeholder: t("workingHoursPlaceholder"),
            postfix: t("hourLabel"),
            validation: [
              {
                type: "pattern",
                value: "^[0-9]+$",
                message: t("workingHoursPattern"),
              },
            ],
          },
          {
            name: "annual_leave",
            label: t("annualLeaveLabel"),
            type: "text",
            placeholder: t("annualLeavePlaceholder"),
            postfix: t("dayLabel"),
            validation: [
              {
                type: "pattern",
                value: "^[0-9]+$",
                message: t("annualLeavePattern"),
              },
              {
                type: "custom",
                validator: (value: any, formValues?: Record<string, any>) => {
                  // Skip validation if no value is provided
                  if (!value || !formValues) return true;

                  // Skip validation if contract_duration is not set
                  if (!formValues.contract_duration) return true;

                  // Convert annual leave (always in days) to a number
                  const annualLeaveDays = Number(value);

                  // Convert contract duration to days
                  const contractDurationValue = Number(
                    formValues.contract_duration
                  );
                  const contractDurationUnit =
                    formValues.contract_duration_unit;
                  const contractDurationInDays = convertToDays(
                    contractDurationValue,
                    contractDurationUnit,
                    timeUnits
                  );

                  // Compare values
                  return annualLeaveDays <= contractDurationInDays;
                },
                message:
                  "عدد أيام الإجازات السنوية لا يمكن أن يكون أكبر من مدة العقد",
              },
            ],
          },
          {
            type: "select",
            name: "state_id",
            label: t("workPlaceLabel"),
            placeholder: t("workPlacePlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/countries/get-states-by-branch`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [],
          },
          {
            name: "right_terminate_id",
            label: t("rightTerminateLabel"),
            type: "select",
            placeholder: t("rightTerminatePlaceholder"),
            dynamicOptions: {
              url: `${baseURL}/right_terminates`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",

              totalCountHeader: "X-Total-Count",
            },
            validation: [],
          },
          {
            name: "file",
            label: t("attachContractLabel"),
            type: "file",
            placeholder: t("attachContractPlaceholder"),
            isMulti: true,
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", // pdf
                "image/jpeg", // jpeg & jpg
                "image/png", // png
              ],
            },
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
      state_id: contract?.state_id,
      right_terminate_id: contract?.right_terminate?.id,
      notice_period_unit:
        contract?.notice_period_unit?.id || timeUnits?.[0]?.id,
      contract_duration_unit:
        contract?.contract_duration_unit?.id || timeUnits?.[0]?.id,
      probation_period_unit:
        contract?.probation_period_unit?.id || timeUnits?.[0]?.id,
      file: contract?.files,
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
        user_id: userId,
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
