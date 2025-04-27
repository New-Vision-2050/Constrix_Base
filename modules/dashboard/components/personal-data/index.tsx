import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import LoadingMenuData from "../LoadingMenuData";
import { useEffect, useState } from "react";
import { UserProfileData } from "@/modules/user-profile/types/user-profile-response";
import { checkString } from "@/utils/check-string";

type PropsT = {
  user: UserProfileData | undefined;
  isLoading: boolean;
};
export default function UserProfilePersonalData({ user, isLoading }: PropsT) {
  const [items, setItems] = useState<string[]>([]);

  // handle side effects
  useEffect(() => {
    if (user) {
      const userItems = [
        `الاسم: ${checkString(user.name)}`,
        `حالة الموظف: ${checkString("--")}`,
        `المهنة: ${checkString(user.job_title ?? "")}`,
        `الدور الوظيفي: ${checkString(user.job_title ?? "")}`,
        `التواصل: ${checkString(user.phone ?? "")}`,
        `الرقم الاضافي: ${checkString(user.other_phone ?? "")}`,
        `البريد الالكتروني: ${checkString(user.email)}`,
        `العنوان الوطني: ${checkString(user.address ?? "")}`,
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
