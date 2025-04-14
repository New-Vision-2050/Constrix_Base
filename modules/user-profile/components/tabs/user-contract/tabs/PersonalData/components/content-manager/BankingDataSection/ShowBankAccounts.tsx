import RegularList from "@/components/shared/RegularList";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import BankSection from "./bank-data";
import { useUserBankingDataCxt } from "./context";

export default function ShowBankAccounts() {
  const { bankAccounts } = useUserBankingDataCxt();
  return (
    <RegularList<BankAccount, "bank">
      sourceName="bank"
      ItemComponent={BankSection}
      items={bankAccounts ?? []}
    />
  );
}
