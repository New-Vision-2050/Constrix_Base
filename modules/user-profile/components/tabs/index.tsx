import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useGetEditModeTabsList } from "../../constants/EditModeTabs";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { useUserProfileCxt } from "../../context/user-profile-cxt";

export default function UserProfileTabs({
  userId,
  companyId,
  children,
}: {
  userId: string;
  companyId: string;
  /** Optional content rendered between the tab bar and the tab panels. */
  children?: ReactNode;
}) {
  // declare and define component state and variables
  const { tab1, setTab1 } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs");
  // declare and define component helper methods
  // return component ui.
  return (
    <HorizontalTabs
      bgStyleApproach
      onTabClick={(tab) => {
        setTab1(tab.id);
      }}
      list={useGetEditModeTabsList(t, userId, companyId)}
      value={tab1 || undefined}
      defaultValue={tab1 !== null ? tab1 : undefined}
    >
      {children}
    </HorizontalTabs>
  );
}
