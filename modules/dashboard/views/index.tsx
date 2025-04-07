"use client";
import UserProfileHeader from "../components/profile-header";
import StatisticsCardsSection from "../components/statistics-cards";
import { UserProfileCxtProvider } from "../context/user-profile-cxt";
import ViewModeManager from "../components/ViewModeManager";

export default function UserDashboardModule() {
  return (
    <UserProfileCxtProvider>
      <div className="flex flex-col gap-12  p-12">
        {/* header */}
        <UserProfileHeader />
        {/* Statistics cards */}
        <StatisticsCardsSection />
        {/* mode manager */}
        <ViewModeManager />
      </div>
    </UserProfileCxtProvider>
  );
}
