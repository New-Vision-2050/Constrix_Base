"use client";

import { useTranslations } from "next-intl";
import FormFieldSet from "../../components/FormFieldSet";
import BalanceCards from "../components/BalanceCards";
import ContractSystemForm from "../components/ContractSystemForm";
import { useAssignmentFormConfig } from "../components/assignment-form-config";
import {
  contractSettingsApi,
  contractSettingsRequestFields,
} from "../api/endpoints";
import { emptyContractBalance } from "../api/map-balance";
import useContractBalance from "../hooks/useContractBalance";

const SUMMARY_SCOPE = "contract-settings-advances";

export default function AdvancesTab({ userId }: { userId: string }) {
  const t = useTranslations("UserProfile.tabs.contractTabs.contractSettings");
  const summaryUrl = contractSettingsApi.advanceSummary(userId);
  const { data, isLoading, isFetching } = useContractBalance(
    SUMMARY_SCOPE,
    summaryUrl,
  );
  const balance = data ?? emptyContractBalance;
  const formConfig = useAssignmentFormConfig({
    formId: "contract-settings-advances-form",
    fieldName: contractSettingsRequestFields.advanceSystemId,
    label: t("advanceSystem"),
    placeholder: t("selectAdvanceSystem"),
    isMulti: false,
    systemsUrl: contractSettingsApi.advanceSystems,
    submitUrl: contractSettingsApi.assignAdvanceSystem,
    initialValue: balance.systemId,
    summaryScope: SUMMARY_SCOPE,
    summaryUrl,
    userId,
    buildBody: (value, currentUserId) => ({
      [contractSettingsRequestFields.userId]: currentUserId,
      [contractSettingsRequestFields.advanceSystemId]: Array.isArray(value)
        ? (value[0] ?? "")
        : (value ?? ""),
    }),
  });

  return (
    <div className="flex flex-col gap-8">
      <BalanceCards
        loading={Boolean(summaryUrl) && (isLoading || isFetching)}
        items={[
          { label: t("entitledAdvances"), value: balance.entitled },
          { label: t("consumedAdvances"), value: balance.consumed },
          { label: t("takenAdvances"), value: balance.taken },
        ]}
      />
      <FormFieldSet title={t("advanceSystem")}>
        <ContractSystemForm config={formConfig} />
      </FormFieldSet>
    </div>
  );
}
