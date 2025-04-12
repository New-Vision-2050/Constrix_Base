import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { BankingDataFormConfig } from "./config/BankingFormConfig";

export default function BankingDataSectionEditMode() {
  return <FormContent config={BankingDataFormConfig()} />;
}
