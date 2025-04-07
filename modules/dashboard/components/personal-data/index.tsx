import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import { useUserProfileCxt } from "../../context/user-profile-cxt";
import LoadingMenuData from "../LoadingMenuData";
import { useEffect, useState } from "react";

export default function UserProfilePersonalData() {
  const { user, isLoading } = useUserProfileCxt();
  const [items, setItems] = useState<string[]>([]);

  // handle side effects
  useEffect(() => {
    if (user) {
      const userItems = [
        `الاسم: ${user.name}`,
        `حالة الموظف: ${'--'}`,
        `المهنة: ${user.job_title}`,
        `الدور الوظيفي: ${user.Job_role}`,
        `التواصل: ${user.phone}`,
        `الرقم الاضافي: ${user.other_phone}`,
        `البريد الالكتروني: ${user.email}`,
        `العنوان الوطني: ${user.address}`,
      ];
      setItems(userItems);
    }
  }, [user]);

  // handle loading state
  if (isLoading) return <LoadingMenuData itemsNumber={5} />;

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
