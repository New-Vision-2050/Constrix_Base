import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import { checkString } from "@/utils/check-string";
import { useTranslations } from "next-intl";

const getBankingDataItems = (bank?: BankAccount): string[] => {
  const t = useTranslations("UserProfile.bankingData");
  if (!bank) return [];
  return [
    `${t("bank_name")}: ${checkString(bank?.bank_name)}`,
    `${t("iban")}: ${checkString(bank?.iban)}`,
    `${t("currency_name")}:  ${checkString(bank?.currency_name)}`,
  ];
};

export default function UserProfileBankingData({
  bank,
}: {
  bank?: BankAccount;
}) {
  const t = useTranslations("UserProfile.bankingData");
  return (
    <UserInformationCardLayout title={t("title")}>
      <RegularList<string, "ProfessionalItemData">
        sourceName="ProfessionalItemData"
        items={getBankingDataItems(bank)}
        keyPrefix="user-profile-banking-data"
        ItemComponent={SigleItem}
      />
    </UserInformationCardLayout>
  );
}

const SigleItem = ({
  ProfessionalItemData,
}: {
  ProfessionalItemData: string;
}) => {
  return <p className="font-md my-1">{ProfessionalItemData}</p>;
};
