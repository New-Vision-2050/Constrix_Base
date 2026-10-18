import { baseURL } from "@/config/axios-config";
import { FieldConfig, FormConfig, useFormInstance } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";
import {
  DaysTypes,
  EntitlementStarts,
  EntitlementTypes,
  PromotionTypes,
} from "@/modules/hr-settings-vacations/constants/days-types";
import { VacationPolicie } from "@/modules/hr-settings-vacations/types/VacationPolicie";
import { VacationType } from "@/modules/hr-settings-vacations/types/VacationType";
import { LeavePolicyCategory } from "@/modules/hr-settings-vacations/types/LeavePolicyCategory";
import {
  OutlinedSelectField,
  OutlinedTextField,
  RadioCardsField,
  SwitchRowField,
} from "../../../shared/OutlinedFields";

export const VACATION_POLICY_FORM_ID = "create-vacation-policy-form";

const NO_PROMOTION = "none";

type Values = Record<string, unknown>;

type PropsT = {
  onSuccessFn: () => void;
  t: ReturnType<typeof useTranslations>;
  leaveTypes: VacationType[];
  leaveCategories?: LeavePolicyCategory[];
  editedPolicy?: VacationPolicie;
};

/**
 * Returns `true` for balance types, `false` for non-balance types and
 * `undefined` while no leave type is selected.
 */
export function resolveIsBalanced(
  leaveTypes: VacationType[],
  leaveTypeId: unknown,
  editedPolicy?: VacationPolicie,
): boolean | undefined {
  if (leaveTypeId === undefined || leaveTypeId === null || leaveTypeId === "") {
    return undefined;
  }
  const type = leaveTypes.find((item) => String(item.id) === String(leaveTypeId));
  if (type) return Boolean(Number(type.is_deduct_from_balance));
  if (editedPolicy && String(editedPolicy.leave_type_id) === String(leaveTypeId)) {
    return Boolean(Number(editedPolicy.is_deduct_from_balance));
  }
  return undefined;
}

const toInt = (value: unknown) =>
  value === undefined || value === null || value === ""
    ? undefined
    : Number(value);

function EntitlementField({
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
      name="entitlement_type"
      heading={t("form.accrual")}
      value={value}
      onChange={onChange}
      options={[
        {
          value: EntitlementTypes.upfront,
          label: t("form.accrualAdvance"),
          description: t("form.accrualAdvanceHint", { days }),
        },
        {
          value: EntitlementTypes.monthly,
          label: t("form.accrualMonthly"),
          description: t("form.accrualMonthlyHint", { days, perMonth }),
        },
      ]}
    />
  );
}

export const getSetVacationPloicyConfig = ({
  onSuccessFn,
  t,
  leaveTypes,
  leaveCategories = [],
  editedPolicy,
}: PropsT): FormConfig => {
  const isEdit = Boolean(editedPolicy);
  const variant = (values: Values) =>
    resolveIsBalanced(leaveTypes, values.leave_type_id, editedPolicy);
  const isBalanced = (values: Values) => variant(values) === true;
  const isWithoutBalance = (values: Values) => variant(values) === false;
  const hasPromotion = (values: Values) =>
    isBalanced(values) && values.promotion_type === PromotionTypes.after_duration;
  const isRolloverOn = (values: Values) =>
    isBalanced(values) && Boolean(values.is_rollover_allowed);

  const leaveTypeOptions = leaveTypes.map((type) => ({
    value: String(type.id),
    label: type.name,
  }));
  if (
    editedPolicy?.leave_type_id &&
    !leaveTypeOptions.some((o) => o.value === String(editedPolicy.leave_type_id))
  ) {
    leaveTypeOptions.push({
      value: String(editedPolicy.leave_type_id),
      label: editedPolicy.leave_type_name ?? "",
    });
  }
  const categoryOptions = leaveCategories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));
  if (
    editedPolicy?.leave_category_id &&
    !categoryOptions.some(
      (o) => o.value === String(editedPolicy.leave_category_id),
    )
  ) {
    categoryOptions.push({
      value: String(editedPolicy.leave_category_id),
      label: editedPolicy.leave_category_name ?? "",
    });
  }
  const dayTypeOptions = [
    { value: DaysTypes.work_day, label: t("form.workDaysOnly") },
    { value: DaysTypes.calendar, label: t("form.calendarDays") },
  ];
  const entitlementStartOptions = [
    { value: EntitlementStarts.hire_date, label: t("form.hireDate") },
  ];
  const promotionOptions = [
    { value: NO_PROMOTION, label: t("form.noUpgrade") },
    { value: PromotionTypes.after_duration, label: t("form.afterPeriod") },
  ];

  const numberField = ({
    name,
    label,
    requiredMessage,
    condition,
  }: {
    name: string;
    label: string;
    requiredMessage?: string;
    condition: (values: Values) => boolean;
  }): FieldConfig => ({
    type: "number",
    name,
    label,
    required: Boolean(requiredMessage),
    condition,
    validation: [
      ...(requiredMessage
        ? [{ type: "required" as const, message: requiredMessage }]
        : []),
      {
        type: "pattern",
        value: /^\d*$/,
        message: t("form.numberRequired"),
      },
    ],
    render: (_field, value, onChange) => (
      <OutlinedTextField
        formId={VACATION_POLICY_FORM_ID}
        type="number"
        name={name}
        label={label}
        value={String(value ?? "")}
        onChange={onChange}
        required={Boolean(requiredMessage)}
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
      leave_category_id: editedPolicy?.leave_category_id
        ? String(editedPolicy.leave_category_id)
        : "",
      name: editedPolicy?.name ?? "",
      max_days: editedPolicy?.max_days ?? "",
      max_balance_days: editedPolicy?.max_balance_days ?? "",
      total_days: editedPolicy?.total_days ?? "",
      min_notice_days: editedPolicy?.min_notice_days ?? "",
      day_calculation_type:
        editedPolicy?.day_calculation_type ?? DaysTypes.work_day,
      entitlement_type: editedPolicy?.entitlement_type ?? EntitlementTypes.upfront,
      entitlement_start_from:
        editedPolicy?.entitlement_start_from ?? EntitlementStarts.hire_date,
      promotion_type: editedPolicy?.promotion_type ?? NO_PROMOTION,
      promotion_duration_months: editedPolicy?.promotion_duration_months ?? "",
      is_rollover_allowed: Boolean(Number(editedPolicy?.is_rollover_allowed ?? 0)),
      rollover_duration_months: editedPolicy?.rollover_duration_months ?? "",
      allow_exceed_balance: Boolean(Number(editedPolicy?.allow_exceed_balance ?? 0)),
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
                disabled={isEdit}
                required
              />
            ),
          },
          {
            type: "select",
            name: "leave_category_id",
            label: t("form.category"),
            required: !isEdit,
            options: categoryOptions,
            validation: isEdit
              ? []
              : [{ type: "required", message: t("form.categoryRequired") }],
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={VACATION_POLICY_FORM_ID}
                name="leave_category_id"
                label={t("form.category")}
                placeholder={t("form.category")}
                value={String(value ?? "")}
                options={categoryOptions}
                onChange={onChange}
                required={!isEdit}
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
                type: "maxLength",
                value: 255,
                message: t("form.nameMaxLength"),
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
          numberField({
            name: "max_days",
            label: t("form.maxDays"),
            requiredMessage: t("form.maxDaysRequired"),
            condition: isWithoutBalance,
          }),
          numberField({
            name: "total_days",
            label: t("form.totalDays"),
            requiredMessage: t("form.totalDaysRequired"),
            condition: isBalanced,
          }),
          numberField({
            name: "max_balance_days",
            label: t("form.maxBalanceDays"),
            condition: isBalanced,
          }),
          numberField({
            name: "min_notice_days",
            label: t("form.minNoticeDays"),
            condition: isBalanced,
          }),
          {
            type: "select",
            name: "day_calculation_type",
            label: t("form.dayCalculation"),
            required: true,
            condition: isBalanced,
            options: dayTypeOptions,
            validation: [{ type: "required", message: t("form.dayTypeRequired") }],
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={VACATION_POLICY_FORM_ID}
                name="day_calculation_type"
                label={t("form.dayCalculation")}
                value={String(value ?? "")}
                options={dayTypeOptions}
                onChange={onChange}
                required
              />
            ),
          },
          {
            type: "radio",
            name: "entitlement_type",
            label: t("form.accrual"),
            required: true,
            condition: isBalanced,
            validation: [
              { type: "required", message: t("form.entitlementRequired") },
            ],
            render: (_field, value, onChange) => (
              <EntitlementField
                t={t}
                value={String(value ?? "")}
                onChange={onChange}
              />
            ),
          },
          {
            type: "select",
            name: "entitlement_start_from",
            label: t("form.accrualStart"),
            condition: isBalanced,
            options: entitlementStartOptions,
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={VACATION_POLICY_FORM_ID}
                name="entitlement_start_from"
                label={t("form.accrualStart")}
                value={String(value ?? "")}
                options={entitlementStartOptions}
                onChange={onChange}
              />
            ),
          },
          {
            type: "select",
            name: "promotion_type",
            label: t("form.upgradeType"),
            condition: isBalanced,
            options: promotionOptions,
            render: (_field, value, onChange) => (
              <OutlinedSelectField
                formId={VACATION_POLICY_FORM_ID}
                name="promotion_type"
                heading={t("form.upgrade")}
                label={t("form.upgradeType")}
                value={String(value ?? NO_PROMOTION)}
                options={promotionOptions}
                onChange={onChange}
              />
            ),
          },
          numberField({
            name: "promotion_duration_months",
            label: t("form.upgradePeriod"),
            requiredMessage: t("form.upgradePeriodRequired"),
            condition: hasPromotion,
          }),
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
          numberField({
            name: "rollover_duration_months",
            label: t("form.rolloverMonths"),
            condition: isRolloverOn,
          }),
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
        ],
      },
    ],
    onSubmit: async (values, formConfig) => {
      const common: Values = {
        ...(values.id ? { id: values.id } : {}),
        name: values.name,
        ...(isEdit ? {} : { leave_type_id: values.leave_type_id }),
        ...(values.leave_category_id
          ? { leave_category_id: values.leave_category_id }
          : {}),
      };

      const body: Values = isBalanced(values)
        ? {
            ...common,
            total_days: toInt(values.total_days),
            max_balance_days: toInt(values.max_balance_days),
            min_notice_days: toInt(values.min_notice_days),
            day_calculation_type: values.day_calculation_type,
            entitlement_type: values.entitlement_type,
            entitlement_start_from: values.entitlement_start_from || undefined,
            ...(hasPromotion(values)
              ? {
                  promotion_type: PromotionTypes.after_duration,
                  promotion_duration_months: toInt(
                    values.promotion_duration_months,
                  ),
                }
              : { promotion_type: null, promotion_duration_months: null }),
            is_rollover_allowed: Boolean(values.is_rollover_allowed),
            rollover_duration_months: values.is_rollover_allowed
              ? toInt(values.rollover_duration_months)
              : null,
            allow_exceed_balance: Boolean(values.allow_exceed_balance),
          }
        : { ...common, max_days: toInt(values.max_days) };

      Object.keys(body).forEach((key) => {
        if (body[key] === undefined) delete body[key];
      });

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
