import RegularList from "@/components/shared/RegularList";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import BankSection from "./bank-data";
import { useUserBankingDataCxt } from "./context";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";

export default function ShowBankAccounts() {
  const { bankAccounts } = useUserBankingDataCxt();

  // handle there is no data found
  if (bankAccounts && bankAccounts.length === 0)
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد حسابات بنكية للمستخدم قم باضافة حساب بنكي"
      />
    );

  // render data
  return (
    <RegularList<BankAccount, "bank">
      sourceName="bank"
      ItemComponent={BankSection}
      items={bankAccounts ?? []}
    />
  );
}
