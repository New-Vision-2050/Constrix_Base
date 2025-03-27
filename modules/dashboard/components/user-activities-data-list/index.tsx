import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import SettingsIcon from "@/public/icons/settings";

type ActivityListItem = {
  text: string;
  icon: JSX.Element;
};
const items: ActivityListItem[] = [
  { text: "item 1", icon: <SettingsIcon /> },
  { text: "item 2", icon: <SettingsIcon /> },
  { text: "item 3", icon: <SettingsIcon /> },
];

export default function UserActivitiesDataList() {
  return (
    <UserInformationCardLayout title="الانشطة">
      <RegularList<ActivityListItem, "item">
        sourceName="item"
        items={items}
        ItemComponent={SigleItem}
      />
    </UserInformationCardLayout>
  );
}

const SigleItem = ({ item }: { item: ActivityListItem }) => {
  return (
    <div className="flex gap-4">
      {item.icon}
      <p className="font-md my-1">{item.text}</p>
    </div>
  );
};
