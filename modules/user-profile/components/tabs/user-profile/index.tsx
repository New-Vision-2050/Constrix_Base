import UserProfileActivityTimeline from "@/modules/dashboard/components/activity-timeline";
import UpcomingMeetings from "@/modules/dashboard/components/upcoming-meetings";
import UserTeams from "@/modules/dashboard/components/user-teams";
import UserProfileGridLayout from "@/modules/dashboard/components/UserProfileGridLayout";
import ProfileGridRightSide from "./ProfileGridRightSide";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export default function UserProfileTab() {
  const { isLoadingUserActivities, userActivities } = useUserProfileCxt();
  return (
    <div className="flex flex-col gap-12">
      <UserProfileGridLayout
        left={
          <div className="flex flex-col gap-3">
            <UserProfileActivityTimeline
              isLoading={isLoadingUserActivities}
              activities={userActivities}
              enableRedirect={true}
              redirectUrl="/activities-logs"
            />
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
        right={<ProfileGridRightSide />}
      />
    </div>
  );
}
