import UserProfileActivityTimeline from "../components/activity-timeline";
import UserProfileBankingData from "../components/Banking-data";
import UserProfilePersonalData from "../components/personal-data";
import UserProfileProfessionalData from "../components/professional-data";
import UserProfileHeader from "../components/profile-header";
import StatisticsCardsSection from "../components/statistics-cards";
import UserActivitiesDataList from "../components/user-activities-data-list";
import UserProfileGridLayout from "../components/UserProfileGridLayout";

export default function UserDashboardModule() {
  return (
    <div className="flex flex-col gap-12  p-12">
      {/* header */}
      <UserProfileHeader />
      {/* Statistics cards */}
      <StatisticsCardsSection />
      {/* grid */}
      <UserProfileGridLayout
        left={
          <div className="flex flex-col gap-3">
            <UserProfileActivityTimeline />
          </div>
        }
        right={
          <div className="flex flex-col gap-3">
            <UserProfilePersonalData />
            <UserProfileProfessionalData />
            <UserProfileBankingData />
            <UserActivitiesDataList />
          </div>
        }
      />
    </div>
  );
}
