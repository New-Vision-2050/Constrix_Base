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

const SUMMARY_SCOPE = "contract-settings-leaves";

export default function LeavesTab({ userId }: { userId: string }) {
  const t = useTranslations("UserProfile.tabs.contractTabs.contractSettings");
  const summaryUrl = contractSettingsApi.leaveSummary(userId);
  const { data, isLoading, isFetching } = useContractBalance(
    SUMMARY_SCOPE,
    summaryUrl,
  );
  const balance = data ?? emptyContractBalance;
  const formConfig = useAssignmentFormConfig({
    formId: "contract-settings-leaves-form",
    fieldName: contractSettingsRequestFields.leaveSystemIds,
    label: t("leaveSystem"),
    placeholder: t("selectLeaveSystem"),
    isMulti: true,
    systemsUrl: contractSettingsApi.leaveSystems,
    submitUrl: contractSettingsApi.assignLeaveSystems,
    initialValue: balance.systemIds,
    summaryScope: SUMMARY_SCOPE,
    summaryUrl,
    userId,
    buildBody: (value, currentUserId) => ({
      [contractSettingsRequestFields.userId]: currentUserId,
      [contractSettingsRequestFields.leaveSystemIds]: Array.isArray(value)
        ? value
        : value
          ? [value]
          : [],
    }),
  });

  return (
    <div className="flex flex-col gap-8">
      <BalanceCards
        loading={Boolean(summaryUrl) && (isLoading || isFetching)}
        items={[
          { label: t("entitledLeaves"), value: balance.entitled },
          { label: t("consumedLeaves"), value: balance.consumed },
          { label: t("takenLeaves"), value: balance.taken },
        ]}
      />
      <FormFieldSet title={t("leaveSystem")}>
        <ContractSystemForm config={formConfig} />
      </FormFieldSet>
    </div>
  );
}
