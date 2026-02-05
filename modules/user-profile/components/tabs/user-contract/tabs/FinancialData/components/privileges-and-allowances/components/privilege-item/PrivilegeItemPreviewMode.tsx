import { UserPrivilege } from "@/modules/user-profile/types/privilege";
import PreviewTextField from "../../../../../components/previewTextField";
import { AllowancesTypes } from "../../AllowancesEnum";
import { useTranslations } from "next-intl";

type PropsT = {
  privilegeData: UserPrivilege;
};

export default function PrivilegeItemPreviewMode({ privilegeData }: PropsT) {
  const t = useTranslations("UserProfile.tabs.financialData.privilegeForm");
  const isSaving =
    privilegeData?.type_allowance_code === AllowancesTypes?.Saving;
  const isPercentage =
    privilegeData?.type_allowance_code === AllowancesTypes?.Percentage;
  const chargeAmountValue = isPercentage?privilegeData?.charge_amount:`${privilegeData?.charge_amount} ر.س`;
  

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("typePrivilegeLabel")}
          value={privilegeData?.type_privilege?.name}
          valid={Boolean(privilegeData?.type_privilege?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("allowanceTypeLabel")}
          value={privilegeData?.type_allowance?.name}
          valid={Boolean(privilegeData?.type_allowance?.name)}
          required
        />
      </div>

      {!isSaving && (
        <>
          <div className="p-2">
            <PreviewTextField
              label={t("chargeAmountPercentageLabel")}
              value={chargeAmountValue}
              valid={Boolean(privilegeData?.charge_amount)}
              required
            />
          </div>
          {isPercentage && (
            <div className="p-2">
              <PreviewTextField
                label={t("periodLabel")}
                value={privilegeData?.period?.name}
                valid={Boolean(privilegeData?.period?.name)}
                required
              />
            </div>
          )}
        </>
      )}

      <div className={`p-2 ${isSaving ? "col-span-2" : ""}`}>
        <PreviewTextField
          label={t("descriptionPercentageLabel")}
          value={privilegeData?.description}
          valid={Boolean(privilegeData?.description)}
          required
        />
      </div>
    </div>
  );
}
