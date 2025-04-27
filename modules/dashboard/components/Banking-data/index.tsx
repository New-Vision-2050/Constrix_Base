import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import { BankAccount } from "@/modules/user-profile/types/bank-account";
import { checkString } from "@/utils/check-string";

const getBankingDataItems = (bank?: BankAccount): string[] => {
  if (!bank) return [];
  return [
    `اسم البنك: ${checkString(bank?.bank_name)}`,
    `الحساب البنكي: ${checkString(bank?.iban)}`,
    `عملة الحساب:  ${checkString(bank?.currency_name)}`,
  ];
};

export default function UserProfileBankingData({
  bank,
}: {
  bank?: BankAccount;
}) {
  return (
    <UserInformationCardLayout title="البيانات البنكية">
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
