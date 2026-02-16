import { UserPrivilege } from "@/modules/user-profile/types/privilege";
import PreviewTextField from "../../../../../components/previewTextField";
import { AllowancesTypes } from "../../AllowancesEnum";

type PropsT = {
  privilegeData: UserPrivilege;
};

export default function PrivilegeItemPreviewMode({ privilegeData }: PropsT) {
  const isSaving =
    privilegeData?.type_allowance_code === AllowancesTypes?.Saving;
  const isPercentage =
    privilegeData?.type_allowance_code === AllowancesTypes?.Percentage;
  const chargeAmountValue = isPercentage?privilegeData?.charge_amount:`${privilegeData?.charge_amount} ر.س`;
  
  // Check if this privilege is medical insurance
  const isMedicalInsurance = privilegeData?.privilege?.type === "MedicalInsurance" ||
                             privilegeData?.privilege?.name?.includes("تأمين طبي") ||
                             privilegeData?.type === "MedicalInsurance" ||
                             privilegeData?.name?.includes("تأمين طبي");

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="نوع البدل"
          value={privilegeData?.type_privilege?.name}
          valid={Boolean(privilegeData?.type_privilege?.name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="نوع البدل"
          value={privilegeData?.type_allowance?.name}
          valid={Boolean(privilegeData?.type_allowance?.name)}
          required
        />
      </div>

      {!isSaving && (
        <>
          <div className="p-2">
            <PreviewTextField
              label="معدل حساب النسبة من اصل الراتب"
              value={chargeAmountValue}
              valid={Boolean(privilegeData?.charge_amount)}
              required
            />
          </div>
          {isPercentage && (
            <div className="p-2">
              <PreviewTextField
                label="وحدة المدة"
                value={privilegeData?.period?.name}
                valid={Boolean(privilegeData?.period?.name)}
                required
              />
            </div>
          )}
        </>
      )}

      {isMedicalInsurance && (
        <div className="p-2">
          <PreviewTextField
            label="التأمين الطبي"
            value={privilegeData?.medical_insurance?.name}
            valid={Boolean(privilegeData?.medical_insurance?.name)}
            required
          />
        </div>
      )}

      <div className={`p-2 ${isSaving ? "col-span-2" : ""}`}>
        <PreviewTextField
          label="وصف حساب النسبة"
          value={privilegeData?.description}
          valid={Boolean(privilegeData?.description)}
          required
        />
      </div>
    </div>
  );
}
