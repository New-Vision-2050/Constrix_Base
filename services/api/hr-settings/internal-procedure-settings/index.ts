import { baseApi } from "@/config/axios/instances/base";
import {
  FormConditionOption,
  FormsConditionApiItem,
  GetFormsConditionsResponse,
  GetInternalProcedureSettingFormsResponse,
  InternalProcedureSettingFormApiItem,
  InternalProcedureSettingFormOption,
  CreateInternalProcedureResponse,
  UpdateInternalProcedureResponse,
  InternalProcedure,
  GetInternalProceduresResponse,
  GetInternalProcedureResponse,
  ConditionSettingSchemaApiItem,
  ConditionSettingSchemaOption,
} from "./types/response";
import {
  CreateInternalProcedureArgs,
  UpdateInternalProcedureArgs,
} from "./types/args";
import { normalizeInternalProcedure } from "./normalize";

function resolveLabel(
  item: { label_ar?: string; label_en?: string; name?: string },
  locale = "ar",
): string {
  const labelAr = item.label_ar ?? item.name ?? "";
  if (locale === "ar") return labelAr;
  return item.label_en ?? labelAr;
}

function mapSettingSchemaItem(
  item: ConditionSettingSchemaApiItem,
  locale = "ar",
): ConditionSettingSchemaOption {
  const labelAr = item.label_ar ?? "";
  return {
    key: item.key,
    type: item.type,
    label_ar: labelAr,
    label_en: item.label_en,
    label: locale === "ar" ? labelAr : item.label_en ?? labelAr,
    default: item.default,
    options: (item.options ?? []).map((option) => {
      const optionLabelAr = option.label_ar ?? option.value;
      return {
        value: option.value,
        label_ar: optionLabelAr,
        label_en: option.label_en,
        label:
          locale === "ar"
            ? optionLabelAr
            : option.label_en ?? optionLabelAr,
      };
    }),
    visibleWhen: item.visible_when
      ? {
          key: item.visible_when.key,
          value: item.visible_when.value,
        }
      : undefined,
  };
}

function mapFormsConditionItem(
  item: FormsConditionApiItem,
  locale = "ar",
): FormConditionOption {
  const categoryLabelAr = item.category_label_ar ?? "";
  const formGroupLabelAr = item.form_group_label_ar ?? "";
  return {
    id: item.key,
    key: item.key,
    type: item.type,
    category: item.category ?? "",
    categoryLabel:
      locale === "ar"
        ? categoryLabelAr
        : item.category_label_en ?? categoryLabelAr,
    name: resolveLabel(item, locale),
    label_ar: item.label_ar,
    label_en: item.label_en,
    formGroup: item.form_group,
    formGroupLabelAr,
    formGroupLabelEn: item.form_group_label_en,
    formGroupLabel:
      locale === "ar"
        ? formGroupLabelAr
        : item.form_group_label_en ?? formGroupLabelAr,
    settingsSchema: (item.settings_schema ?? []).map((schemaItem) =>
      mapSettingSchemaItem(schemaItem, locale),
    ),
  };
}

function mapInternalProcedureSettingFormItem(
  item: InternalProcedureSettingFormApiItem,
  locale = "ar",
): InternalProcedureSettingFormOption | null {
  const id =
    item.id != null
      ? String(item.id)
      : item.key != null
        ? String(item.key)
        : null;
  const label_ar = item.label_ar ?? item.name;

  if (!id || !label_ar) return null;

  return {
    id,
    key: item.key ?? id,
    type: item.type ?? "",
    name: resolveLabel({ label_ar, label_en: item.label_en, name: item.name }, locale),
    label_ar,
    label_en: item.label_en,
  };
}

export const InternalProcedureSettingsApi = {
  /** Lists available forms (النماذج) for the action dialog. */
  getInternalProcedureSettingForms: async (
    type: string,
    locale = "ar",
  ): Promise<InternalProcedureSettingFormOption[]> => {
    const response = await baseApi.get<GetInternalProcedureSettingFormsResponse>(
      "admin/internal_procedure_setting_forms",
      {
        params: {
          type,
        },
      },
    );
    const payload = response.data?.payload ?? [];
    return payload
      .map((item) => mapInternalProcedureSettingFormItem(item, locale))
      .filter((item): item is InternalProcedureSettingFormOption => item != null);
  },

  /** Lists form condition definitions for the selected form. */
  getFormsConditions: async (
    formType: string,
    locale = "ar",
  ): Promise<FormConditionOption[]> => {
    const response = await baseApi.get<GetFormsConditionsResponse>(
      "procedure-settings/forms-conditions",
      {
        params: {
          type: formType,
        },
      },
    );
    const payload = response.data?.payload ?? response.data?.data ?? [];
    return payload.map((item) => mapFormsConditionItem(item, locale));
  },

  createInternalProcedure: async (
    args: CreateInternalProcedureArgs,
  ): Promise<InternalProcedure> => {
    const response = await baseApi.post<CreateInternalProcedureResponse>(
      "procedure-settings/internal-procedures",
      args,
    );
    return normalizeInternalProcedure(response.data.payload);
  },

  getInternalProcedures: async (
    type: string,
  ): Promise<InternalProcedure[]> => {
    const response = await baseApi.get<GetInternalProceduresResponse>(
      "procedure-settings/internal-procedures",
      { params: { type } },
    );
    return (response.data?.payload ?? []).map((item) =>
      normalizeInternalProcedure(item),
    );
  },

  getInternalProcedure: async (
    procedureSettingId: string,
  ): Promise<InternalProcedure> => {
    const response = await baseApi.get<GetInternalProcedureResponse>(
      `procedure-settings/${procedureSettingId}`,
    );
    const payload = response.data?.payload;
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid internal procedure response");
    }
    return normalizeInternalProcedure(payload as unknown as Record<string, unknown>);
  },

  updateInternalProcedure: async (
    procedureSettingId: string,
    internalProcedureId: string,
    args: UpdateInternalProcedureArgs,
  ): Promise<InternalProcedure> => {
    const response = await baseApi.post<UpdateInternalProcedureResponse>(
      `procedure-settings/${procedureSettingId}/internal-procedures/${internalProcedureId}`,
      args,
    );
    return normalizeInternalProcedure(response.data.payload);
  },

  deleteInternalProcedure: async (
    procedureSettingId: string,
    internalProcedureId: string,
  ): Promise<void> => {
    await baseApi.delete(
      `procedure-settings/${procedureSettingId}/internal-procedures/${internalProcedureId}`,
    );
  },
};
