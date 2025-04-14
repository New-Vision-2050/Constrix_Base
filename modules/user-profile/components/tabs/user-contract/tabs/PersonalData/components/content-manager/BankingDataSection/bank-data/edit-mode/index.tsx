import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { BankingDataFormConfig } from "./config/BankingFormConfig";
import { BankAccount } from "@/modules/user-profile/types/bank-account";

type PropsT = { bank: BankAccount };

export default function BankingDataSectionEditMode({ bank }: PropsT) {
  return <FormContent config={BankingDataFormConfig({ bank })} />;
}
