import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";

const items: string[] = [
  "الاسم: محمد خالد مشعل",
  "حالة الموظف:    -",
  "المهنة:    -",
  "الدور الوظيفي:    - ",
  "التواصل: 0545236605",
  "الرقم الاضافي: 0545236605",
  "البريد الالكتروني: AhmedSaeed@gmail.com",
  "العنوان الوطني: جدة - حي الصفا",
];

export default function UserProfilePersonalData() {
  return (
    <UserInformationCardLayout title="بيانات الشخصية">
      <RegularList<string, "personalItemData">
        sourceName="personalItemData"
        items={items}
        keyPrefix="user-profile-personal-data"
        ItemComponent={SigleItem}
      />
    </UserInformationCardLayout>
  );
}

const SigleItem = ({ personalItemData }: { personalItemData: string }) => {
  return <p className="font-md my-1">{personalItemData}</p>;
};
