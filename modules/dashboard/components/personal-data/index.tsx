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
