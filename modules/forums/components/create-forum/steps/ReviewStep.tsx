"use client";

import { useLocale, useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import SectionCard from "../../ui/SectionCard";
import SwitchRow from "../../ui/SwitchRow";
import InfoNote from "../../ui/InfoNote";
import { useCurrentCompany } from "../../../hooks/use-company";
import { formatNumber } from "../../../utils/format";
import type { WizardController } from "../useCreateForumWizard";

export default function ReviewStep({ wizard }: { wizard: WizardController }) {
  const t = useTranslations("Forums");
  const locale = useLocale();
  const company = useCurrentCompany();

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title={t("wizard.review.basicSection")}>
        <dl className="flex flex-col gap-3">
          <SummaryRow
            label={t("wizard.basic.name")}
            value={wizard.name || "—"}
          />
          <SummaryRow
            label={t("wizard.basic.company")}
            value={company.name || "—"}
          />
          <SummaryRow
            label={t("wizard.basic.visibility")}
            value={t(`visibility.${wizard.visibility}`)}
          />
        </dl>
      </SectionCard>

      <SectionCard title={t("wizard.review.peopleSection")}>
        <dl className="flex flex-col gap-3">
          <SummaryRow
            label={t("common.admins")}
            value={
              wizard.admins.length > 0
                ? wizard.admins.map((admin) => admin.name).join("، ")
                : "—"
            }
          />
          <SummaryRow
            label={t("common.members")}
            value={t("wizard.review.membersValue", {
              count: formatNumber(wizard.members.length, locale),
            })}
          />
          <SummaryRow
            label={t("common.groups")}
            value={t("wizard.review.groupsValue")}
          />
        </dl>
      </SectionCard>

      <SwitchRow
        label={t("wizard.review.notify")}
        hint={t("wizard.review.notifyHint")}
        checked={wizard.notifyMembers}
        onChange={wizard.setNotifyMembers}
      />

      <InfoNote icon={<Eye />}>{t("wizard.review.publishNote")}</InfoNote>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-xs text-muted-foreground">{label}</dt>
      <dd className="text-end text-sm text-foreground">{value}</dd>
    </div>
  );
}
