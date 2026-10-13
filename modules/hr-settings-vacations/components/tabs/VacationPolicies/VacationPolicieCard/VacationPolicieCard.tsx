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
import {
  DaysTypes,
  PromotionTypes,
} from "@/modules/hr-settings-vacations/constants/days-types";
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
  const isBalanced = Boolean(Number(policy.is_deduct_from_balance));

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
          value={String(policy.total_days ?? "-")}
        />

        {isBalanced ? (
          <>
            <PolicyDetail
              label={t("totalDays")}
              value={String(policy.total_days ?? "-")}
            />

            <PolicyDetail
              label={t("dayType")}
              value={
                policy.day_calculation_type === DaysTypes.calendar
                  ? t("calendar")
                  : t("work_day")
              }
            />

            <PolicyToggle
              label={t("IsTheLeaveCarriedOver")}
              enabledLabel={t("leaveCarriedOver")}
              disabledLabel={t("leaveNotCarriedOver")}
              enabled={Boolean(Number(policy.is_rollover_allowed))}
            />

            <PolicyToggle
              label={t("allowExceedBalance")}
              enabledLabel={t("allowed")}
              disabledLabel={t("notAllowed")}
              enabled={Boolean(Number(policy.allow_exceed_balance))}
            />

            <PolicyFooter
              note={
                policy.promotion_type === PromotionTypes.after_duration
                  ? t("promotionAfter", {
                      months: policy.promotion_duration_months ?? 0,
                    })
                  : t("noUpgradeCondition")
              }
            />
          </>
        ) : (
          <PolicyDetail
            label={t("maxDays")}
            value={String(policy.max_days ?? "-")}
          />
        )}
      </div>
    </div>
  );
};

export default VacationPolicieCard;
