import UserProfileHeader from "../components/profile-header";
import StatisticsCardsSection from "../components/statistics-cards";
import UserInformationCardLayout from "../components/UserInformationCardLayout";
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
        left={<>left section</>}
        right={
          <>
            <UserInformationCardLayout title="البيانات الشخصية">
              User Data List
            </UserInformationCardLayout>
          </>
        }
      />
    </div>
  );
}
