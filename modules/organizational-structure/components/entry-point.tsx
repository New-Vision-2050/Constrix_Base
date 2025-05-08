
import StatisticsCardsList from "./statistics-cards-list";
import OrganizationalStructureTabs from "./organizational-structure-tabs";
import CompanyHeader from "@/modules/company-profile/components/shared/company-header";

export default function OrganizationalStructureEntryPoint() {
  return (
    <div className="flex flex-col gap-12  p-12">
      {/* header */}
      <CompanyHeader />

      {/* Statistics cards */}
      <StatisticsCardsList />

      {/* tabs */}
      <OrganizationalStructureTabs />
    </div>
  );
}
