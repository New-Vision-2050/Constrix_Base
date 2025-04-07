import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../../UserInformationCardLayout";

const items: string[] = [];

export default function UserProfileBankingData() {
  return (
    <UserInformationCardLayout title="البيانات المهنية">
      <RegularList<string, "ProfessionalItemData">
        sourceName="ProfessionalItemData"
        items={items}
        keyPrefix="user-profile-banking-data"
        ItemComponent={SigleItem}
      />
    </UserInformationCardLayout>
  );
}

const SigleItem = ({ ProfessionalItemData }: { ProfessionalItemData: string }) => {
  return <p className="font-md my-1">{ProfessionalItemData}</p>;
};
