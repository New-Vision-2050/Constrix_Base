import { baseURL } from "@/config/axios-config";
import { FieldConfig, FormConfig, useFormInstance } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";
import { DaysTypes } from "@/modules/hr-settings-vacations/constants/days-types";
import { VacationPolicie } from "@/modules/hr-settings-vacations/types/VacationPolicie";
import { VacationType } from "@/modules/hr-settings-vacations/types/VacationType";
import {
  OutlinedSelectField,
  OutlinedTextareaField,
  OutlinedTextField,
  RadioCardsField,
  SwitchRowField,
} from "../../../shared/OutlinedFields";

export const VACATION_POLICY_FORM_ID = "create-vacation-policy-form";

const AccrualTypes = { advance: "advance", monthly: "monthly" } as const;
const AccrualStarts = { hireDate: "hire_date", yearStart: "year_start" } as const;
const UpgradeTypes = { none: "none", afterPeriod: "after_period" } as const;

type PropsT = {
  onSuccessFn: () => void;
  t: ReturnType<typeof useTranslations>;
  leaveTypes: VacationType[];
  editedPolicy?: VacationPolicie;
};

export function isUnpaidLeaveType(
  leaveTypes: VacationType[],
  leaveTypeId: unknown,
) {
  if (leaveTypeId === undefined || leaveTypeId === null || leaveTypeId === "") {
    return false;
  }
  const type = leaveTypes.find((item) => String(item.id) === String(leaveTypeId));
  return Boolean(type) && !type?.is_deduct_from_balance;
}

function AccrualField({
  t,
  value,
  onChange,
}: {
  t: ReturnType<typeof useTranslations>;
  value: string;
  onChange: (value: string) => void;
}) {
  const { values } = useFormInstance(VACATION_POLICY_FORM_ID);
  const days = Number(values?.total_days) || 0;
  const perMonth = Math.round((days / 12) * 100) / 100;

  return (
    <RadioCardsField
      formId={VACATION_POLICY_FORM_ID}
      name="accrual_type"
      heading={t("form.accrual")}
      value={value}
      onChange={onChange}
      options={[
        {
          value: AccrualTypes.advance,
          label: t("form.accrualAdvance"),
          description: t("form.accrualAdvanceHint", { days }),
        },
        {
          value: AccrualTypes.monthly,
          label: t("form.accrualMonthly"),
          description: t("form.accrualMonthlyHint", { days, perMonth }),
        },
      ]}
    />
  );
}

const numberRule = (message: string) => ({
  type: "pattern" as const,
  value: /^\d+(\.\d+)?$/,
  message,
});

export const getSetVacationPloicyConfig = ({
  onSuccessFn,
  t,
  leaveTypes,
  editedPolicy,
}: PropsT): FormConfig => {
  const isEdit = Boolean(editedPolicy);
  const isBalanced = (values: Record<string, unknown>) =>
    Boolean(values.leave_type_id) &&
    !isUnpaidLeaveType(leaveTypes, values.leave_type_id);
  const isUpgradeAfterPeriod = (values: Record<string, unknown>) =>
    isBalanced(values) && values.upgrade_type === UpgradeTypes.afterPeriod;
  const isRolloverOn = (values: Record<string, unknown>) =>
    isBalanced(values) && Boolean(values.is_rollover_allowed);

  const leaveTypeOptions = leaveTypes.map((type) => ({
    value: String(type.id),
    label: type.name,
  }));
  const dayTypeOptions = [
    { value: DaysTypes.work_day, label: t("form.workDaysOnly") },
    { value: DaysTypes.calender, label: t("form.calendarDays") },
  ];
  const accrualStartOptions = [
    { value: AccrualStarts.hireDate, label: t("form.hireDate") },
    { value: AccrualStarts.yearStart, label: t("form.yearStart") },
  ];
  const upgradeOptions = [
    { value: UpgradeTypes.none, label: t("form.noUpgrade") },
    { value: UpgradeTypes.afterPeriod, label: t("form.afterPeriod") },
  ];

  const numberField = (
    name: string,
    label: string,
    requiredMessage: string,
    condition?: (values: Record<string, unknown>) => boolean,
  ): FieldConfig => ({
    type: "number",
    name,
    label,
    required: true,
    condition,
    validation: [
      { type: "required", message: requiredMessage },
      numberRule(t("form.numberRequired")),
    ],
    render: (_field, value, onChange) => (
      <OutlinedTextField
        formId={VACATION_POLICY_FORM_ID}
        type="number"
        name={name}
        label={label}
        value={String(value ?? "")}
        onChange={onChange}
        required
      />
    ),
  });

  return {
    formId: VACATION_POLICY_FORM_ID,
    title: isEdit ? t("form.editTitle") : t("form.title"),
    apiUrl: `${baseURL}/leave-policies`,
    editApiUrl: `${baseURL}/leave-policies/${editedPolicy?.id}`,
    editApiMethod: "PUT",
    isEditMode: isEdit,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    initialValues: {
      leave_type_id: editedPolicy?.leave_type_id
        ? String(editedPolicy.leave_type_id)
        : "",
      name: editedPolicy?.name ?? "",
      total_days: editedPolicy?.total_days ?? "",
      max_balance_days: editedPolicy?.max_balance_days ?? "",
      min_notice_days: editedPolicy?.min_notice_days ?? 0,
      day_type: editedPolicy?.day_type ?? DaysTypes.work_day,
      accrual_type: editedPolicy?.accrual_type ?? AccrualTypes.advance,
      accrual_start: editedPolicy?.accrual_start ?? AccrualStarts.hireDate,
      upgrade_type: editedPolicy?.upgrade_type ?? UpgradeTypes.none,
      upgrade_after_months: editedPolicy?.upgrade_after_months ?? "",
      is_rollover_allowed: editedPolicy?.is_rollover_allowed ?? false,
      rollover_months: editedPolicy?.rollover_months ?? "",
      allow_exceed_balance: editedPolicy?.allow_exceed_balance ?? false,
      is_allow_half_day: editedPolicy?.is_allow_half_day ?? false,
      notes: editedPolicy?.notes ?? "",
    },
    subWrapperParentClassName:
      "!border-0 !rounded-none !mb-0 !bg-transparent !shadow-none",
    subWrapperClassName: "!bg-transparent !p-0",
    sections: [
      {
        collapsible: false,
        fields: [
          {
            type: "select",
            name: "leave_type_id",
            label: t("form.leaveType"),
            required: true,
            options: leaveTypeOptions,
            validation: [{ type: "required", message: t("form.leaveTypeRequired") }],
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={VACATION_POLICY_FORM_ID}
                name="leave_type_id"
                heading={t("form.basicData")}
                label={t("form.leaveType")}
                placeholder={t("form.leaveType")}
                value={String(value ?? "")}
                options={leaveTypeOptions}
                onChange={onChange}
              />
            ),
          },
          {
            type: "text",
            name: "name",
            label: t("form.systemName"),
            required: true,
            validation: [
              { type: "required", message: t("form.nameRequired") },
              {
                type: "pattern",
                value: /^[\p{L}\p{N}\s]+$/u,
                message: t("form.namePattern"),
              },
            ],
            render: (_field, value, onChange) => (
              <OutlinedTextField
                formId={VACATION_POLICY_FORM_ID}
                name="name"
                label={t("form.systemName")}
                value={String(value ?? "")}
                onChange={onChange}
                required
              />
            ),
          },
          numberField(
            "total_days",
            t("form.totalDays"),
            t("form.totalDaysRequired"),
            isBalanced,
          ),
          numberField(
            "max_balance_days",
            t("form.maxBalanceDays"),
            t("form.maxBalanceDaysRequired"),
          ),
          numberField(
            "min_notice_days",
            t("form.minNoticeDays"),
            t("form.minNoticeDaysRequired"),
            isBalanced,
          ),
          {
            type: "select",
            name: "day_type",
            label: t("form.dayCalculation"),
            required: true,
            condition: isBalanced,
            options: dayTypeOptions,
            validation: [{ type: "required", message: t("form.dayTypeRequired") }],
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={VACATION_POLICY_FORM_ID}
                name="day_type"
                label={t("form.dayCalculation")}
                value={String(value ?? "")}
                options={dayTypeOptions}
                onChange={onChange}
              />
            ),
          },
          {
            type: "radio",
            name: "accrual_type",
            label: t("form.accrual"),
            condition: isBalanced,
            render: (_field, value, onChange) => (
              <AccrualField
                t={t}
                value={String(value ?? "")}
                onChange={onChange}
              />
            ),
          },
          {
            type: "select",
            name: "accrual_start",
            label: t("form.accrualStart"),
            condition: isBalanced,
            options: accrualStartOptions,
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={VACATION_POLICY_FORM_ID}
                name="accrual_start"
                label={t("form.accrualStart")}
                value={String(value ?? "")}
                options={accrualStartOptions}
                onChange={onChange}
              />
            ),
          },
          {
            type: "select",
            name: "upgrade_type",
            label: t("form.upgradeType"),
            condition: isBalanced,
            options: upgradeOptions,
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={VACATION_POLICY_FORM_ID}
                name="upgrade_type"
                heading={t("form.upgrade")}
                label={t("form.upgradeType")}
                value={String(value ?? "")}
                options={upgradeOptions}
                onChange={onChange}
              />
            ),
          },
          numberField(
            "upgrade_after_months",
            t("form.upgradePeriod"),
            t("form.upgradePeriodRequired"),
            isUpgradeAfterPeriod,
          ),
          {
            type: "checkbox",
            name: "is_rollover_allowed",
            label: t("form.rolloverToNextYear"),
            condition: isBalanced,
            render: (_field, value, onChange) => (
              <SwitchRowField
                heading={t("form.rolloverAndOptions")}
                label={t("form.rolloverToNextYear")}
                value={Boolean(value)}
                onChange={onChange}
              />
            ),
          },
          numberField(
            "rollover_months",
            t("form.rolloverMonths"),
            t("form.rolloverMonthsRequired"),
            isRolloverOn,
          ),
          {
            type: "checkbox",
            name: "allow_exceed_balance",
            label: t("form.allowExceedBalance"),
            condition: isBalanced,
            render: (_field, value, onChange) => (
              <SwitchRowField
                label={t("form.allowExceedBalance")}
                value={Boolean(value)}
                onChange={onChange}
              />
            ),
          },
          {
            type: "textarea",
            name: "notes",
            label: t("form.notes"),
            condition: isBalanced,
            render: (_field, value, onChange) => (
              <OutlinedTextareaField
                formId={VACATION_POLICY_FORM_ID}
                name="notes"
                label={t("form.notes")}
                value={String(value ?? "")}
                onChange={onChange}
              />
            ),
          },
        ],
      },
    ],
    onSubmit: async (values, formConfig) => {
      const body = isBalanced(values)
        ? values
        : {
            ...(values.id ? { id: values.id } : {}),
            leave_type_id: values.leave_type_id,
            name: values.name,
            max_balance_days: values.max_balance_days,
          };
      return defaultSubmitHandler(body, formConfig);
    },
    onSuccess: () => {
      onSuccessFn();
    },
    resetOnSuccess: true,
    showReset: false,
    showCancelButton: false,
    showBackButton: false,
    showSubmitLoader: true,
    submitButtonText: t("form.submitButtonText"),
    cancelButtonText: t("form.cancelButtonText"),
  };
};
