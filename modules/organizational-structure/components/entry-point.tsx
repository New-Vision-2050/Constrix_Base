import UserProfileHeader from "@/components/shared/profile-header";
import StatisticsCardsList from "./statistics-cards-list";
import OrganizationalStructureTabs from "./organizational-structure-tabs";

export default function OrganizationalStructureEntryPoint() {
  return (
    <div className="flex flex-col gap-12  p-12">
      {/* header */}
      <UserProfileHeader
        // imgSrc={'image-url'}
        loading={false}
        branch={"فرع الرياض"}
        name={"ابعاد الرؤية للاستشارات الهندسية"}
        date_appointment={"04/05/2024"}
      />

      {/* Statistics cards */}
      <StatisticsCardsList />

      {/* tabs */}
      <OrganizationalStructureTabs />
    </div>
  );
}
