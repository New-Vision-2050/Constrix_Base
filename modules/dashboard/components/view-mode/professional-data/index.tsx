import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../../UserInformationCardLayout";

const items: string[] = [];

export default function UserProfileProfessionalData() {
  return (
    <UserInformationCardLayout title="البيانات المهنية">
      <RegularList<string, "userProfessionalItemData">
        sourceName="userProfessionalItemData"
        items={items}
        keyPrefix="user-profile-professional-data"
        ItemComponent={SigleItem}
      />
    </UserInformationCardLayout>
  );
}

const SigleItem = ({ userProfessionalItemData }: { userProfessionalItemData: string }) => {
  return <p className="font-md my-1">{userProfessionalItemData}</p>;
};
