import RegularList from "@/components/shared/RegularList";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import BankSection from "./bank-data";
import { useUserBankingDataCxt } from "./context";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";
import { useTranslations } from "next-intl";

export default function ShowBankAccounts() {
  const { bankAccounts, bankAccountsLoading } = useUserBankingDataCxt();
  const t = useTranslations("UserProfile.tabs.CommonSections");

  // handle there is no data found
  if (!bankAccountsLoading && bankAccounts && bankAccounts.length === 0)
    return (
      <NoDataFounded
        title={t("noDataFound")}
        subTitle={t("noBankAccounts")}
      />
    );

  // render data
  return (
    <>
      {bankAccountsLoading ? (
        <TabTemplateListLoading />
      ) : (
        <RegularList<BankAccount, "bank">
          sourceName="bank"
          ItemComponent={BankSection}
          items={bankAccounts ?? []}
        />
      )}
    </>
  );
}
