import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { UserProfileData } from "@/modules/user-profile/types/user-profile-response";


const getBankingDataItems = (user?: UserProfileData): string[] => {
  if (!user || !user?.bank_account) return [];
  return [
    `اسم البنك: ${user?.bank_account?.bank_name ?? "-"}`,
    `الحساب البنكي: ${user?.bank_account?.iban ?? "-"}`,
    `عملة الحساب:  ${user?.bank_account?.currency_name ?? "-"}`,
  ];
};


export default function UserProfileBankingData() {
  const { user } = useUserProfileCxt();
  return (
    <UserInformationCardLayout title="البيانات البنكية">
      <RegularList<string, "ProfessionalItemData">
        sourceName="ProfessionalItemData"
        items={getBankingDataItems(user)}
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
