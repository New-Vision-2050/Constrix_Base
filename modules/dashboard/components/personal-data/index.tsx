import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import LoadingMenuData from "../LoadingMenuData";
import { useEffect, useState } from "react";
import { UserProfileData } from "@/modules/user-profile/types/user-profile-response";
import { checkString } from "@/utils/check-string";
import { useTranslations } from "next-intl";

type PropsT = {
  user: UserProfileData | undefined;
  isLoading: boolean;
};
export default function UserProfilePersonalData({ user, isLoading }: PropsT) {
  const t = useTranslations("UserProfile.personalData");
  const [items, setItems] = useState<string[]>([]);

  // handle side effects
  useEffect(() => {
    if (user) {
      const userItems = [
        `${t("name")}: ${checkString(user.name)}`,
        `${t("status")}: ${checkString("--")}`,
        `${t("jobTitle")}: ${checkString(user.job_title ?? "")}`,
        `${t("jobRole")}: ${checkString(user.job_title ?? "")}`,
        `${t("phone")}: ${checkString(user.phone ?? "")}`,
        `${t("otherPhone")}: ${checkString(user.other_phone ?? "")}`,
        `${t("email")}: ${checkString(user.email)}`,
        `${t("nationalAddress")}: ${checkString(user.address ?? "")}`,
      ];
      setItems(userItems);
    }
  }, [user]);

  // handle loading state
  if (isLoading) return <LoadingMenuData itemsNumber={5} />;

  return (
    <UserInformationCardLayout title={t("title")}>
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
