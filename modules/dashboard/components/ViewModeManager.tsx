import { useUserProfileCxt } from "../context/user-profile-cxt";
import UserProfileGridLayout from "./UserProfileGridLayout";
import UserProfileActivityTimeline from "./view-mode/activity-timeline";
import UserProfileBankingData from "./view-mode/Banking-data";
import UserProfilePersonalData from "./view-mode/personal-data";
import UserProfileProfessionalData from "./view-mode/professional-data";
import UpcomingMeetings from "./view-mode/upcoming-meetings";
import UserActivitiesDataList from "./view-mode/user-activities-data-list";
import UserProjectsData from "./view-mode/user-projects";
import UserTeams from "./view-mode/user-teams";

export default function ViewModeManager() {
  const { isEditMode } = useUserProfileCxt();
  
  return (
    <>
      {isEditMode ? (
        <>MainPointOfEditUserProfile</>
      ) : (
        <>
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
        </>
      )}
    </>
  );
}
