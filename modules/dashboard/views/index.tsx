import UserProfileHeader from "../components/profile-header";
import StatisticsCardsSection from "../components/statistics-cards";

export default function UserDashboardModule() {
  return (
    <div className="flex flex-col gap-12  p-12">
      {/* header */}
      <UserProfileHeader />
      {/* Statistics cards */}
      <StatisticsCardsSection />
    </div>
  );
}
