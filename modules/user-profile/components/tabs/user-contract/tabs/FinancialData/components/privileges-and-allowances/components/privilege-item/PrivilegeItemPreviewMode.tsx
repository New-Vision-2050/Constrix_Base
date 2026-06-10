import { UserPrivilege } from "@/modules/user-profile/types/privilege";
import PreviewTextField from "../../../../../components/previewTextField";
import { AllowancesTypes } from "../../AllowancesEnum";
import { useTranslations } from "next-intl";

type PropsT = {
  privilegeData: UserPrivilege;
};

export default function PrivilegeItemPreviewMode({ privilegeData }: PropsT) {
  const t = useTranslations(
    "UserProfile.nestedTabs.privilegesAndAllowances.view",
  );
  const isSaving =
    privilegeData?.type_allowance_code === AllowancesTypes?.Saving;
  const isPercentage =
    privilegeData?.type_allowance_code === AllowancesTypes?.Percentage;
  const chargeAmountValue = isPercentage
    ? privilegeData?.charge_amount
    : `${privilegeData?.charge_amount} ر.س`;

  // Check if this privilege is medical insurance
  const isMedicalInsurance =
    privilegeData?.privilege?.type === "MedicalInsurance" ||
    privilegeData?.privilege?.type === "health_insurance" ||
    privilegeData?.privilege?.name?.includes("تأمين طبي");

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Show Policy Number for Medical Insurance */}
      {isMedicalInsurance && (
        <div className="p-2">
          <PreviewTextField
            label={t("medicalInsurancePolicyNumber")}
            value={privilegeData?.medical_insurance?.policy_number || "---"}
            valid={Boolean(privilegeData?.medical_insurance?.policy_number)}
            required
          />
        </div>
      )}

      {/* Add empty div to maintain 2-column grid if policy number exists */}
      {isMedicalInsurance && (
        <div className="p-2">
          <PreviewTextField
            label={t("allowanceType")}
            value={privilegeData?.type_privilege?.name}
            valid={Boolean(privilegeData?.type_privilege?.name)}
            required
          />
        </div>
      )}

      {/* If no policy number, show first field normally */}
      {!isMedicalInsurance && (
        <div className="p-2">
          <PreviewTextField
            label={t("allowanceType")}
            value={privilegeData?.type_privilege?.name}
            valid={Boolean(privilegeData?.type_privilege?.name)}
            required
          />
        </div>
      )}

      <div className="p-2">
        <PreviewTextField
          label={t("allowanceType")}
          value={privilegeData?.type_allowance?.name}
          valid={Boolean(privilegeData?.type_allowance?.name)}
          required
        />
      </div>

      {!isSaving && (
        <>
          <div className="p-2">
            <PreviewTextField
              label={t("calculationRate")}
              value={chargeAmountValue}
              valid={Boolean(privilegeData?.charge_amount)}
              required
            />
          </div>
          {isPercentage && (
            <div className="p-2">
              <PreviewTextField
                label={t("periodUnit")}
                value={privilegeData?.period?.name}
                valid={Boolean(privilegeData?.period?.name)}
                required
              />
            </div>
          )}
        </>
      )}

      {/* Add empty div if no period field to maintain grid */}
      {!isSaving && !isPercentage && <div className="p-2"></div>}

      <div className="p-2">
        <PreviewTextField
          label={t("description")}
          value={privilegeData?.description}
          valid={Boolean(privilegeData?.description)}
          required
        />
      </div>

      {/* Show subscription info for medical insurance with saving */}
      {isMedicalInsurance && isSaving && privilegeData?.subscriptions?.[0] && (
        <>
          <div className="p-2">
            <PreviewTextField
              label={t("subscriptionNo")}
              value={privilegeData.subscriptions[0].subscription_no || "---"}
              valid={Boolean(privilegeData.subscriptions[0].subscription_no)}
              required
            />
          </div>
          <div className="p-2">
            <PreviewTextField
              label={t("amount")}
              value={`${privilegeData.subscriptions[0].amount} ر.س`}
              valid={Boolean(privilegeData.subscriptions[0].amount)}
              required
            />
          </div>
          <div className="p-2">
            <PreviewTextField
              label={t("subscriptionType")}
              value={
                privilegeData.subscriptions[0].subscription_type === "family"
                  ? "عائلي"
                  : "فردي"
              }
              valid={Boolean(privilegeData.subscriptions[0].subscription_type)}
              required
            />
          </div>
          {privilegeData.subscriptions[0].family_members &&
            privilegeData.subscriptions[0].family_members.length > 0 && (
              <div className="p-2">
                <PreviewTextField
                  label={t("familyMembersCount")}
                  value={`${privilegeData.subscriptions[0].family_members.length}`}
                  valid={true}
                  required
                />
              </div>
            )}
        </>
      )}

      {/* Add empty div at the end to complete the grid */}
      <div className="p-2"></div>
    </div>
  );
}
