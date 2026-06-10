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
  const isConstant =
    privilegeData?.type_allowance_code === AllowancesTypes?.Constant;

  // Check if this privilege is medical insurance
  const isMedicalInsurance =
    privilegeData?.privilege?.type === "MedicalInsurance" ||
    privilegeData?.privilege?.type === "health_insurance" ||
    privilegeData?.privilege?.name?.includes("تأمين طبي");

  const subscription = privilegeData?.subscriptions?.[0];

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Allowance Type (عائلي / فردي) */}
      <div className="p-2">
        <PreviewTextField
          label={t("allowanceType")}
          value={privilegeData?.type_privilege?.name}
          valid={Boolean(privilegeData?.type_privilege?.name)}
          required
        />
      </div>

      {/* Allowance Type Category (توفير / ثابت) */}
      <div className="p-2">
        <PreviewTextField
          label={t("allowanceTypeCategory")}
          value={privilegeData?.type_allowance?.name}
          valid={Boolean(privilegeData?.type_allowance?.name)}
          required
        />
      </div>

      {/* Medical Insurance - Policy Number */}
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

      {/* Medical Insurance with Saving - Subscription data */}
      {isMedicalInsurance && isSaving && subscription && (
        <>
          {subscription.medical_insurance_category && (
            <div className="p-2">
              <PreviewTextField
                label={t("category")}
                value={subscription.medical_insurance_category.name || "---"}
                valid={Boolean(subscription.medical_insurance_category.name)}
                required
              />
            </div>
          )}
          <div className="p-2">
            <PreviewTextField
              label={t("subscriptionNo")}
              value={subscription.subscription_no || "---"}
              valid={Boolean(subscription.subscription_no)}
              required
            />
          </div>
          <div className="p-2">
            <PreviewTextField
              label={t("amount")}
              value={`${subscription.amount} ر.س`}
              valid={Boolean(subscription.amount)}
              required
            />
          </div>
          <div className="p-2">
            <PreviewTextField
              label={t("subscriptionType")}
              value={
                subscription.subscription_type === "family" ? "عائلي" : "فردي"
              }
              valid={Boolean(subscription.subscription_type)}
              required
            />
          </div>
          {subscription.family_members &&
            subscription.family_members.length > 0 && (
              <div className="p-2">
                <PreviewTextField
                  label={t("familyMembersCount")}
                  value={`${subscription.family_members.length}`}
                  valid={true}
                  required
                />
              </div>
            )}
        </>
      )}

      {/* Constant type - charge_amount and period */}
      {isConstant && (
        <>
          <div className="p-2">
            <PreviewTextField
              label={t("amount")}
              value={`${privilegeData?.charge_amount} ر.س`}
              valid={Boolean(privilegeData?.charge_amount)}
              required
            />
          </div>
          <div className="p-2">
            <PreviewTextField
              label={t("periodUnit")}
              value={privilegeData?.period?.name}
              valid={Boolean(privilegeData?.period?.name)}
              required
            />
          </div>
        </>
      )}

      {/* Description - only for non-saving types */}
      {!isSaving && (
        <div className="p-2">
          <PreviewTextField
            label={t("description")}
            value={privilegeData?.description}
            valid={Boolean(privilegeData?.description)}
            required
          />
        </div>
      )}
    </div>
  );
}
