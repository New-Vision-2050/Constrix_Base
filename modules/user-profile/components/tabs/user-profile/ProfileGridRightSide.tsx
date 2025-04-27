"use client";
import UserProfileBankingData from "@/modules/dashboard/components/Banking-data";
import UserProfilePersonalData from "@/modules/dashboard/components/personal-data";
import UserProfileProfessionalData from "@/modules/dashboard/components/professional-data";
import UserActivitiesDataList from "@/modules/dashboard/components/user-activities-data-list";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export default function ProfileGridRightSide() {
  const { user, isLoading } = useUserProfileCxt();

  return (
    <div className="flex flex-col gap-3">
      <UserProfilePersonalData user={user} isLoading={isLoading} />
      <UserProfileProfessionalData data={user?.user_professional_data} />
      <UserProfileBankingData bank={user?.bank_account} />
      <UserActivitiesDataList />
    </div>
  );
}
