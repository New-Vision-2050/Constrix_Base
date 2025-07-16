'use client';
import CanSeeContent from "@/components/shared/CanSeeContent";
import TabsGroup from "@/components/shared/TabsGroup";
import { can } from "@/hooks/useCan";
import CompanyHeader from "@/modules/company-profile/components/shared/company-header";
import EmployeeCard from "@/modules/company-profile/components/shared/employee-card";
import { CompanyTabs } from "@/modules/company-profile/components/shared/tabs";
import {
  PERMISSION_ACTIONS,
  PERMISSION_SUBJECTS,
} from "@/modules/roles-and-permissions/permissions";

const CompanyProfileSec = () => {
  const canSee = can(
    PERMISSION_ACTIONS.VIEW,
    PERMISSION_SUBJECTS.COMPANY_PROFILE
  ) as boolean;
  return (
    <CanSeeContent canSee={canSee}>
      <div className="px-8 space-y-7">
        <CompanyHeader />
        <EmployeeCard />
        <TabsGroup
          tabs={CompanyTabs}
          defaultValue="company"
          variant="primary"
        />
      </div>
    </CanSeeContent>
  );
};

export default CompanyProfileSec;
