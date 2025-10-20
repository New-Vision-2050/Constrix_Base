import RegularList from "@/components/shared/RegularList";
import UserProfileTableDataMainLayout from "../UserProfileTableDataMainLayout";
import SingleListItem, { ListItemType } from "./SingleListItem";
import { useTranslations } from "next-intl";

// dummy data
const avatarSrc =
  "https://images.unsplash.com/photo-1588410670460-cdab54625253?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const items: ListItemType[] = [
  {
    avatarSrc,
    title: "أجتماع مع مدير الشركة",
    subtitle: "05/08/2024  |   08:30م",
    chipLabel: "عاجل",
    chipColor: "primary",
  },
  {
    avatarSrc,
    title: "مشروع العليا",
    subtitle: "05/08/2024  |   08:30م",
    chipLabel: "قريبا",
    chipColor: "secondary",
  },
  {
    avatarSrc,
    title: "أجتماع مع مدير الشركة",
    subtitle: "05/08/2024  |   08:30م",
    chipLabel: "عاجل",
    chipColor: "primary",
  },
  {
    avatarSrc,
    title: "مشروع العليا",
    subtitle: "05/08/2024  |   08:30م",
    chipLabel: "قريبا",
    chipColor: "secondary",
  },
];

export default function UpcomingMeetings() {
  const t = useTranslations("UserProfile.upcomingMeetings");
  return (
    <UserProfileTableDataMainLayout title={t("title")}>
      <div className="flex gap-4 flex-col">
        <RegularList<ListItemType, "item">
          items={items}
          sourceName="item"
          keyPrefix="upcoming-meetings"
          ItemComponent={SingleListItem}
        />
        <div className="flex items-center justify-center p-2 w-full h-6">
          <p className="text-semibold">{t("showAll")}</p>
        </div>
      </div>
    </UserProfileTableDataMainLayout>
  );
}
