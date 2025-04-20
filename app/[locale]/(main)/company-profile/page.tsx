import TabsGroup from "@/components/shared/TabsGroup";
import CompanyHeader from "@/modules/company-profile/components/shared/company-header";
import EmployeeCard from "@/modules/company-profile/components/shared/employee-card";
import { CompanyTabs } from "@/modules/company-profile/components/shared/tabs";

const CompanyProfileSec = () => {
  return (
    <div className="px-8 space-y-7">
      <CompanyHeader
        companyName="ابعاد الرؤية للاستشارات الهندسية"
        joinDate="04/05/2024"
      />
      <EmployeeCard />
      <TabsGroup tabs={CompanyTabs} defaultValue="company" variant="primary" />
    </div>
  );
};

export default CompanyProfileSec;
