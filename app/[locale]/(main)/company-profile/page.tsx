"use client";
import TabsGroup from "@/components/shared/TabsGroup";
import CompanyHeader from "@/modules/company-profile/components/shared/company-header";
import EmployeeCard from "@/modules/company-profile/components/shared/employee-card";
import { CompanyTabs } from "@/modules/company-profile/components/shared/tabs";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { withPermissionsPage } from "@/lib/permissions/client/withPermissionsPage";

const CompanyProfileSec = () => {
  return (
    <div className="px-8 space-y-7">
      <CompanyHeader />
      <EmployeeCard />
      <TabsGroup
        tabs={CompanyTabs()}
        defaultValue="company"
        variant="primary"
      />
    </div>
  );
};

export default withPermissionsPage(CompanyProfileSec, [
  Object.values(PERMISSIONS.companyProfile).flatMap((p) => Object.values(p)),
]);
