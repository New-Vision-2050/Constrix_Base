/**
 * VacationPolicieCard - Main component that displays a vacation policy card
 * Based on the VacationPolicie type
 */
import React from "react";
import PolicyHeader from "./PolicyHeader";
import PolicyDetail from "./PolicyDetail";
import PolicyToggle from "./PolicyToggle";
import PolicyFooter from "./PolicyFooter";
import { VacationPolicie } from "@/modules/hr-settings-vacations/types/VacationPolicie";
import { useTranslations } from "next-intl";

interface VacationPolicieCardProps {
  /** The policy data to display */
  policy: VacationPolicie;
  /** Optional className for styling */
  className?: string;
}

/**
 * Renders a vacation policy card with all its details
 */
const VacationPolicieCard: React.FC<VacationPolicieCardProps> = ({
  policy,
  className = "",
}) => {
  const t = useTranslations("HRSettingsVacations.leavesPolicies");

  return (
    <div
      className={`bg-transparent border border-gray-600 p-6 rounded-lg shadow-md ${className}`}
    >
      {/* Policy Title */}
      <PolicyHeader policy={policy} />

      {/* Policy Details */}
      <div className="space-y-4">
        <PolicyDetail
          label={t("totalDays")}
          value={policy.total_days.toString()}
        />

        <PolicyDetail label={t("dayType")} value={policy.day_type === "calender" ? t("calender") : t("work_day")} />

        {/* Policy Toggles */}
        <PolicyToggle
          label={t("IsTheLeaveCarriedOver")}
          enabledLabel={t("leaveCarriedOver")}
          disabledLabel={t("leaveNotCarriedOver")}
          enabled={policy.is_rollover_allowed}
        />

        <PolicyToggle
          label={t("isAllowHalfDay")}
          enabledLabel={t("allowed")}
          disabledLabel={t("notAllowed")}
          enabled={policy.is_allow_half_day}
        />

        {/* Policy Note/Footer */}
        <PolicyFooter
          note={
            policy.upgrade_condition
              ? policy.upgrade_condition
              : t("noUpgradeCondition")
          }
        />
      </div>
    </div>
  );
};

export default VacationPolicieCard;
