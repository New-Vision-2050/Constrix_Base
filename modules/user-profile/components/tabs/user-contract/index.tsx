import { useTranslations } from "next-intl";
import { GetUserContractTabsList } from "./constants/UserContractTabs";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export default function UserContractTab({ userId, companyId }: { userId: string, companyId: string }) {
  // declare and define component state and variables.
  const { tab2, setTab2 } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs.contractTabs");
  // declare and define component helper methods.
  // return component ui.
  return (
    <HorizontalTabs
      onTabClick={(tab) => {
        setTab2(tab.id);
      }}
      list={GetUserContractTabsList(t, userId, companyId)}
      defaultValue={tab2 !== null ? tab2 : undefined}
    />
  );
}
