import { useUserDashboardCxt } from "../context/user-dashboard-cxt";
import UserProfileBankingData from "./Banking-data";
import UserProfilePersonalData from "./personal-data";
import UserProfileProfessionalData from "./professional-data";
import UserActivitiesDataList from "./user-activities-data-list";

export default function DashboardRightSide() {
  const { user, isLoading } = useUserDashboardCxt();
  return (
    <div className="flex flex-col gap-3">
      <UserProfilePersonalData user={user} isLoading={isLoading} />
      <UserProfileProfessionalData />
      <UserProfileBankingData />
      <UserActivitiesDataList />
    </div>
  );
}
