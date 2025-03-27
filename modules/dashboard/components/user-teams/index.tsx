import RegularList from "@/components/shared/RegularList";
import UserProfileTableDataMainLayout from "../UserProfileTableDataMainLayout";
import SingleListItem, {
  ListItemType,
} from "../upcoming-meetings/SingleListItem";

// dummy data
const avatarSrc =
  "https://images.unsplash.com/photo-1588410670460-cdab54625253?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const items: ListItemType[] = [
  {
    avatarSrc,
    title: "مشروع العليا جديد",
    subtitle: "05/08/2024  |   08:30م",
    chipLabel: "مهندس",
    chipColor: "primary",
  },
  {
    avatarSrc,
    title: "مشروع العليا",
    subtitle: "05/08/2024  |   08:30م",
    chipLabel: "مهندس",
    chipColor: "secondary",
  },
  {
    avatarSrc,
    title: "مشروع العليا جديد",
    subtitle: "05/08/2024  |   08:30م",
    chipLabel: "مهندس",
    chipColor: "primary",
  },
  {
    avatarSrc,
    title: "مشروع العليا",
    subtitle: "05/08/2024  |   08:30م",
    chipLabel: "مهندس",
    chipColor: "secondary",
  },
];

export default function UserTeams() {
  return (
    <UserProfileTableDataMainLayout title="الفريق">
      <div className="flex gap-4 flex-col">
        <RegularList<ListItemType, "item">
          items={items}
          sourceName="item"
          ItemComponent={SingleListItem}
        />
        <div className="flex items-center justify-center p-2 w-full h-6">
          <p className="text-semibold">اظهار الكل</p>
        </div>
      </div>
    </UserProfileTableDataMainLayout>
  );
}
