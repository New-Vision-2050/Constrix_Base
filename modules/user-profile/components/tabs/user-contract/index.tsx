import { useTranslations } from "next-intl";
import { GetUserContractTabsList } from "./constants/UserContractTabs";
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

const FIRST_VERTICAL_TAB_IDS: Record<string, string> = {
  "user-contract-tab-personal-data": "contract-tab-personal-data-section",
  "user-contract-tab-academic-experience":
    "contract-tab-academic-experience-qualification",
  "user-contract-tab-job-contract": "functional-tab-contractual-contract-data",
  "user-contract-tab-financial": "financial-data-salaries",
};

const getFirstVerticalTabId = (tab2Id: string): string => {
  return FIRST_VERTICAL_TAB_IDS[tab2Id] || "";
};

export default function UserContractTab({
  userId,
  companyId,
}: {
  userId: string;
  companyId: string;
}) {
  // declare and define component state and variables.
  const { tab2, setTab2, setVerticalSection } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs.contractTabs");

  // declare and define component helper methods.
  // return component ui.
  return (
    <HorizontalTabs
      onTabClick={(tab) => {
        setTab2(tab.id);
        // Set verticalSection to first vertical tab of the selected horizontal tab
        const firstVerticalTabId = getFirstVerticalTabId(tab.id);
        setVerticalSection(firstVerticalTabId);
      }}
      list={GetUserContractTabsList(t, userId, companyId)}
      value={tab2 || undefined}
      defaultValue={tab2 !== null ? tab2 : undefined}
    />
  );
}
