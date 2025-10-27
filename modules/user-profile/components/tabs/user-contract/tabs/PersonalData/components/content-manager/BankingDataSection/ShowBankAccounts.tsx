import RegularList from "@/components/shared/RegularList";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import BankSection from "./bank-data";
import { useUserBankingDataCxt } from "./context";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function ShowBankAccounts() {
  const t = useTranslations("UserProfile.nestedTabs.bankingData");
  const { bankAccounts, bankAccountsLoading } = useUserBankingDataCxt();

  // handle there is no data found
  if (!bankAccountsLoading && bankAccounts && bankAccounts.length === 0)
    return (
      <NoDataFounded
        title={t("noData")}
        subTitle={t("noDataSubTitle")}
      />
    );

  // render data
  return (
    <>
      {bankAccountsLoading ? (
        <TabTemplateListLoading />
      ) : (
        <Can check={[PERMISSIONS.profile.bankInfo.view]}>
          <RegularList<BankAccount, "bank">
            sourceName="bank"
            ItemComponent={BankSection}
            items={bankAccounts ?? []}
          />
        </Can>
      )}
    </>
  );
}
