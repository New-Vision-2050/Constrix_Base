import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { AdvancePolicy } from "@/modules/hr-settings-advances/types/AdvancePolicy";
import { getSetAdvancePolicyFormConfig } from "./SetAdvancePolicyForm";

export const getAdvancePolicyTableConfig = () => {
  const t = useTranslations("HRSettingsAdvances.policies");
  return {
    url: `${baseURL}/advance-policies`,
    tableId: "advance-policies-table",
    columns: [
      {
        key: "name",
        label: t("name"),
        sortable: true,
        render: (_: unknown, row: AdvancePolicy) => row.name,
      },
      {
        key: "max_amount",
        label: t("maxAmount"),
        render: (_: unknown, row: AdvancePolicy) =>
          Number(row.max_amount).toLocaleString(),
      },
      {
        key: "max_installments",
        label: t("maxInstallments"),
      },
      {
        key: "max_active_advances",
        label: t("maxActiveAdvances"),
      },
      {
        key: "requires_attachment",
        label: t("requiresAttachment"),
        render: (_: unknown, row: AdvancePolicy) =>
          Number(row.requires_attachment) ? t("required") : t("notRequired"),
      },
      {
        key: "created_at",
        label: t("createdAt"),
        render: (_: unknown, row: AdvancePolicy) => row.created_at ?? "—",
      },
    ],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    enableExport: false,
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: getSetAdvancePolicyFormConfig(t, () => {}),
    executions: [],
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
    deleteConfirmMessage: t("DeleteConfirmMessage"),
  };
};
