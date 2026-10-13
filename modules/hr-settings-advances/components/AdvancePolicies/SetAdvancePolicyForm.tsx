import { FieldConfig, FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";
import {
  OutlinedSelectField,
  OutlinedTextField,
  SwitchRowField,
} from "../shared/OutlinedFields";
import {
  EntitlementStarts,
  RepaymentMethods,
  RepaymentSystems,
  TerminationActions,
} from "../../constants/advance-policy-options";

export const ADVANCE_POLICY_FORM_ID = "advance-policies-form";

type Values = Record<string, unknown>;

const isBlank = (value: unknown) =>
  value === undefined || value === null || value === "";

const toNumber = (value: unknown) => (isBlank(value) ? null : Number(value));

const isIntInRange = (value: unknown, min: number, max: number) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= min && num <= max;
};

const isAfterDuration = (values: Values) =>
  values.entitlement_start_from === EntitlementStarts.after_duration;
const isRepayable = (values: Values) => Boolean(values.is_repayable);
const isInstallments = (values: Values) =>
  isRepayable(values) &&
  values.repayment_system === RepaymentSystems.installments;

export function getSetAdvancePolicyFormConfig(
  t: ReturnType<typeof useTranslations>,
  onSuccessFn: () => void
): FormConfig {
  const numberField = ({
    name,
    label,
    heading,
    requiredMessage,
    rangeMessage,
    isValid,
    condition,
    step,
  }: {
    name: string;
    label: string;
    heading?: string;
    requiredMessage: string;
    rangeMessage: string;
    isValid: (value: unknown, values: Values) => boolean;
    condition?: (values: Values) => boolean;
    step?: string;
  }): FieldConfig => ({
    type: "number",
    name,
    label,
    required: true,
    condition,
    validation: [
      { type: "required", message: requiredMessage },
      {
        type: "custom",
        message: rangeMessage,
        validator: (value, values) =>
          isBlank(value) || isValid(value, values ?? {}),
      },
    ],
    render: (_field, value, onChange) => (
      <OutlinedTextField
        formId={ADVANCE_POLICY_FORM_ID}
        type="number"
        step={step}
        name={name}
        label={label}
        heading={heading}
        value={String(value ?? "")}
        onChange={onChange}
        required
      />
    ),
  });

  const selectField = ({
    name,
    label,
    heading,
    options,
    condition,
  }: {
    name: string;
    label: string;
    heading?: string;
    options: { value: string; label: string }[];
    condition?: (values: Values) => boolean;
  }): FieldConfig => ({
    type: "select",
    name,
    label,
    options,
    condition,
    render: (_field, value, onChange) => (
      <OutlinedSelectField
        formId={ADVANCE_POLICY_FORM_ID}
        name={name}
        label={label}
        heading={heading}
        placeholder={t("form.selectPlaceholder")}
        value={String(value ?? "")}
        options={options}
        onChange={onChange}
      />
    ),
  });

  return {
    formId: ADVANCE_POLICY_FORM_ID,
    title: t("form.title"),
    apiUrl: `${baseURL}/advance-policies`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    initialValues: {
      entitlement_start_from: EntitlementStarts.hire_date,
      is_repayable: true,
      repayment_system: RepaymentSystems.installments,
      repayment_method: RepaymentMethods.salary_deduction,
      termination_action: TerminationActions.deduct_from_dues,
      max_active_advances: 1,
      requires_attachment: false,
    },
    subWrapperParentClassName:
      "!border-0 !rounded-none !mb-0 !bg-transparent !shadow-none",
    subWrapperClassName: "!bg-transparent !p-0",
    sections: [
      {
        collapsible: false,
        fields: [
          {
            type: "text",
            name: "name",
            label: t("form.name"),
            required: true,
            validation: [
              { type: "required", message: t("form.nameRequired") },
              { type: "maxLength", value: 255, message: t("form.nameMaxLength") },
            ],
            render: (_field, value, onChange) => (
              <OutlinedTextField
                formId={ADVANCE_POLICY_FORM_ID}
                name="name"
                heading={t("form.basicData")}
                label={t("form.name")}
                placeholder={t("form.namePlaceholder")}
                value={String(value ?? "")}
                onChange={onChange}
                required
              />
            ),
          },
          numberField({
            name: "max_amount",
            label: t("form.maxAmount"),
            requiredMessage: t("form.maxAmountRequired"),
            rangeMessage: t("form.maxAmountRange"),
            isValid: (value) => {
              const num = Number(value);
              return num >= 0.01 && num <= 9999999999.99;
            },
            step: "0.01",
          }),
          numberField({
            name: "min_amount",
            label: t("form.minAmount"),
            requiredMessage: t("form.minAmountRequired"),
            rangeMessage: t("form.minAmountGreaterThanMax"),
            isValid: (value, values) =>
              isBlank(values.max_amount) ||
              Number(value) <= Number(values.max_amount),
            step: "0.01",
          }),

          selectField({
            name: "entitlement_start_from",
            label: t("form.entitlementStart"),
            heading: t("form.entitlement"),
            options: [
              { value: EntitlementStarts.hire_date, label: t("form.fromHireDate") },
              {
                value: EntitlementStarts.after_duration,
                label: t("form.afterDurationFromHire"),
              },
            ],
          }),
          numberField({
            name: "entitlement_after_months",
            label: t("form.entitlementMonths"),
            requiredMessage: t("form.entitlementMonthsRequired"),
            rangeMessage: t("form.numberRequired"),
            isValid: (value) => isIntInRange(value, 1, 1200),
            condition: isAfterDuration,
          }),

          {
            type: "checkbox",
            name: "is_repayable",
            label: t("form.isRepayable"),
            render: (_field, value, onChange) => (
              <SwitchRowField
                heading={t("form.repayment")}
                label={t("form.isRepayable")}
                value={Boolean(value)}
                onChange={onChange}
              />
            ),
          },
          selectField({
            name: "repayment_system",
            label: t("form.repaymentSystem"),
            options: [
              { value: RepaymentSystems.installments, label: t("form.installments") },
              { value: RepaymentSystems.total_amount, label: t("form.totalAmount") },
            ],
            condition: isRepayable,
          }),
          numberField({
            name: "max_installments",
            label: t("form.repaymentMonths"),
            requiredMessage: t("form.repaymentMonthsRequired"),
            rangeMessage: t("form.repaymentMonthsRange"),
            isValid: (value) => isIntInRange(value, 1, 120),
            condition: isInstallments,
          }),
          selectField({
            name: "repayment_method",
            label: t("form.repaymentMethod"),
            options: [
              {
                value: RepaymentMethods.salary_deduction,
                label: t("form.salaryDeduction"),
              },
              { value: RepaymentMethods.manual, label: t("form.manualPayment") },
            ],
            condition: isRepayable,
          }),

          selectField({
            name: "termination_action",
            label: t("form.terminationAction"),
            heading: t("form.termination"),
            options: [
              {
                value: TerminationActions.deduct_from_dues,
                label: t("form.deductFromDues"),
              },
              {
                value: TerminationActions.collect_cash,
                label: t("form.collectCash"),
              },
            ],
          }),
        ],
      },
    ],
    editDataTransformer: (data) => ({
      id: data.id,
      name: data.name,
      max_amount: data.max_amount ?? "",
      min_amount: data.min_amount ?? "",
      entitlement_start_from:
        data.entitlement_start_from ?? EntitlementStarts.hire_date,
      entitlement_after_months: data.entitlement_after_months ?? "",
      is_repayable: Boolean(Number(data.is_repayable ?? 1)),
      repayment_system: data.repayment_system ?? RepaymentSystems.installments,
      max_installments: data.max_installments ?? "",
      repayment_method:
        data.repayment_method ?? RepaymentMethods.salary_deduction,
      termination_action:
        data.termination_action ?? TerminationActions.deduct_from_dues,
      max_active_advances: data.max_active_advances ?? 1,
      requires_attachment: Boolean(Number(data.requires_attachment)),
    }),
    onSubmit: async (values, formConfig) => {
      const repayable = isRepayable(values);
      const installments = isInstallments(values);

      return defaultSubmitHandler(
        {
          ...(values.id ? { id: values.id } : {}),
          name: values.name,
          max_amount: toNumber(values.max_amount),
          min_amount: toNumber(values.min_amount),
          entitlement_start_from: values.entitlement_start_from,
          entitlement_after_months: isAfterDuration(values)
            ? toNumber(values.entitlement_after_months)
            : null,
          is_repayable: repayable,
          repayment_system: repayable ? values.repayment_system : null,
          max_installments: installments ? toNumber(values.max_installments) : 1,
          repayment_method: repayable ? values.repayment_method : null,
          termination_action: values.termination_action,
          max_active_advances: toNumber(values.max_active_advances) ?? 1,
          requires_attachment: Boolean(values.requires_attachment),
        },
        formConfig
      );
    },
    onSuccess: onSuccessFn,
    submitButtonText: t("form.submitButtonText"),
    showReset: false,
    showSubmitLoader: true,
    resetOnSuccess: true,
    resetOnOpen: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
