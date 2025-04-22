"use client";
import StatisticsCardsSection from "../components/statistics-cards";
import UserProfileGridLayout from "../components/UserProfileGridLayout";
import UserProfileActivityTimeline from "../components/activity-timeline";
import UpcomingMeetings from "../components/upcoming-meetings";
import UserTeams from "../components/user-teams";
import DashboardRightSide from "../components/DashboardRightSide";
import { useUserDashboardCxt } from "../context/user-dashboard-cxt";
import UserProfileHeader from "@/components/shared/profile-header";

export default function DashboardEntryPoint() {
  const { user, isLoading, userPersonalData } = useUserDashboardCxt();

  return (
    <div className="flex flex-col gap-12  p-12">
      {/* header */}
      <UserProfileHeader
        imgSrc={user?.image_url}
        loading={isLoading}
        name={
          userPersonalData?.is_default == 1
            ? userPersonalData?.nickname
            : userPersonalData?.name
        }
        job_title={user?.job_title}
        address={user?.address}
        date_appointment={user?.date_appointment}
      />
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
            {/* <UserProjectsData /> */}
          </div>
        }
        right={<DashboardRightSide />}
      />
    </div>
  );
}
