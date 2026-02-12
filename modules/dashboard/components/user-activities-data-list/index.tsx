"use client";

import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import SettingsIcon from "@/public/icons/settings";
import { useTranslations } from "next-intl";
import useUserInfoAlert from "../../hooks/useUserInfoAlert";
import { InfoAlertItem } from "../../api/fetch-user-info-alert";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

const TYPE_TO_TAB2_MAP: Record<string, string> = {
  identity: "contract-tab-personal-data-section",
  entry_number: "contract-tab-iqama-data-section",
  border_number: "contract-tab-iqama-data-section",
  work_permit: "contract-tab-iqama-data-section",
  passport: "contract-tab-personal-data-section",
  bank_account: "contract-tab-banking-data-section",
};

export default function UserActivitiesDataList() {
  const t = useTranslations("UserProfile.activitiesData");
  const { data: items = [], isLoading } = useUserInfoAlert();

  return (
    <UserInformationCardLayout title={t("title")}>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          {t("noActivities")}
        </p>
      ) : (
        <RegularList<InfoAlertItem, "activityItem">
          sourceName="activityItem"
          items={items}
          keyPrefix="user-activities-data-list"
          ItemComponent={SingleItem}
        />
      )}
    </UserInformationCardLayout>
  );
}

const SingleItem = ({ activityItem }: { activityItem: InfoAlertItem }) => {
  const { setTab1, setTab2, setVerticalSection } = useUserProfileCxt();

  const handleNavigate = () => {
    const tab2Value = TYPE_TO_TAB2_MAP[activityItem.type];
    if (tab2Value) {
      setTab1("edit-mode-tabs-contract");
      setTab2("user-contract-tab-personal-data");
      setVerticalSection(tab2Value);
    }
  };

  return (
    <div className="flex gap-4 items-center justify-between mt-3">
      <p className="font-md my-1">{activityItem.title}</p>
      <button
        onClick={handleNavigate}
        className="hover:opacity-70 transition-opacity cursor-pointer"
        title={activityItem.title}
      >
        <SettingsIcon />
      </button>
    </div>
  );
};
