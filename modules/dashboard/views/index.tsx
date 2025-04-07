"use client";
import UserProfileHeader from "../components/profile-header";
import StatisticsCardsSection from "../components/statistics-cards";
import { UserProfileCxtProvider } from "../context/user-profile-cxt";
import UserProfileGridLayout from "../components/UserProfileGridLayout";
import UserProfileActivityTimeline from "../components/activity-timeline";
import UpcomingMeetings from "../components/upcoming-meetings";
import UserTeams from "../components/user-teams";
import UserProjectsData from "../components/user-projects";
import UserProfilePersonalData from "../components/personal-data";
import UserProfileProfessionalData from "../components/professional-data";
import UserProfileBankingData from "../components/Banking-data";
import UserActivitiesDataList from "../components/user-activities-data-list";

export default function UserDashboardModule() {
  return (
    <UserProfileCxtProvider>
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
              <div className="flex flex-col md:flex-row gap-2 justify-between">
                <div className="flex-grow p-8 w-full md:w-1/2">
                  <UpcomingMeetings />
                </div>
                <div className="flex-grow p-8 w-full md:w-1/2">
                  <UserTeams />
                </div>
              </div>
              <UserProjectsData />
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
    </UserProfileCxtProvider>
  );
}
