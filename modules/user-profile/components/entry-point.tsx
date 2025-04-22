import UserProfileTabs from "../components/tabs";
import StatisticsCardsSection from "../components/statistics-cards";
import { useUserProfileCxt } from "../context/user-profile-cxt";
import UserProfileHeader from "@/components/shared/profile-header";

export default function UserProfileEntryPoint() {
  const { user, isLoading, userPersonalData } = useUserProfileCxt();

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
      {/* tabs */}
      <UserProfileTabs />
    </div>
  );
}
