import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { ConnnectionFormConfig } from "./ConnnectionFormConfig";
import { EmailFormConfig } from "./EmailFormConfig";
import { OTPVerifyDialog } from "../edit-mode/OTPVerify";
import { useConnectionOTPCxt } from "../context/ConnectionOTPCxt";


export default function UserProfileConnectionDataEditForm2() {
  const { openPhoneOtp, openMailOtp, togglePhoneOtpDialog, toggleMailOtpDialog } = useConnectionOTPCxt();
  const phoneFormConfig = ConnnectionFormConfig();
  const emailFormConfig = EmailFormConfig();
  
  return (
    <>
      <OTPVerifyDialog
        identifier={phoneFormConfig.initialValues?.phone as string}
        open={openPhoneOtp}
        setOpen={togglePhoneOtpDialog}
      />
      <OTPVerifyDialog
        identifier={emailFormConfig.initialValues?.email as string}
        open={openMailOtp}
        setOpen={toggleMailOtpDialog}
      />
      <div className="space-y-6">
        <FormContent config={phoneFormConfig} />
        <FormContent config={emailFormConfig} />
      </div>
    </>
  );
}
