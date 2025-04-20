'use client';
import UserProfileBankingData from "@/modules/dashboard/components/Banking-data";
import UserProfilePersonalData from "@/modules/dashboard/components/personal-data";
import UserProfileProfessionalData from "@/modules/dashboard/components/professional-data";
import UserActivitiesDataList from "@/modules/dashboard/components/user-activities-data-list";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { UserProfileData as DashboardUserProfileData } from "@/modules/dashboard/types/user-profile-response";
import { UserProfileData as UserProfileUserProfileData } from "@/modules/user-profile/types/user-profile-response";

// Adapter function to convert user-profile data to dashboard format
const adaptUserProfileData = (
  userProfileData: UserProfileUserProfileData | undefined
): DashboardUserProfileData | undefined => {
  if (!userProfileData) return undefined;
  
  // Create a dashboard-compatible user profile object with default values for missing properties
  return {
    id: userProfileData.id,
    global_id: userProfileData.global_id || "",
    name: userProfileData.name,
    email: userProfileData.email,
    residence: "",
    passport: "",
    identity: "",
    border_number: "",
    phone: "",
    job_title_id: "",
    job_title: userProfileData.job_title || "",
    country: userProfileData.country || { id: "", name: "", status: "", sms_driver: "" },
    data_status: 0,
    company: userProfileData.company ? [userProfileData.company] : [],
    Job_role: userProfileData.role || "",
    date_appointment: userProfileData.date_appointment || "",
    branch: "",
    other_phone: "",
    address: userProfileData.address || "",
    address_attendance: "",
    image_url: userProfileData.image_url,
  };
};

export default function ProfileGridRightSide() {
  const { user, isLoading } = useUserProfileCxt();
  
  // Convert user-profile data to dashboard format
  const dashboardUser = adaptUserProfileData(user);

  return (
    <div className="flex flex-col gap-3">
      <UserProfilePersonalData user={dashboardUser} isLoading={isLoading} />
      <UserProfileProfessionalData />
      <UserProfileBankingData />
      <UserActivitiesDataList />
    </div>
  );
}
