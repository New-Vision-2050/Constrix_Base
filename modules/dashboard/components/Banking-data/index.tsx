import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";

const items: string[] = [];

export default function UserProfileBankingData() {
  return (
    <UserInformationCardLayout title="البيانات المهنية">
      <RegularList<string, "item">
        sourceName="item"
        items={items}
        ItemComponent={SigleItem}
      />
    </UserInformationCardLayout>
  );
}

const SigleItem = ({ item }: { item: string }) => {
  return <p className="font-md my-1">{item}</p>;
};
