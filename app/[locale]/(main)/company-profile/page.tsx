import CompanyHeader from "@/modules/company-profile/components/shared/company-header";
import CompanyProfileTaps from "@/modules/company-profile/components/shared/company-profile-taps";
import EmployeeCard from "@/modules/company-profile/components/shared/employee-card";

const CompanyProfilePage = () => {
  return (
    <div className="px-8 space-y-7">
      <CompanyHeader
        companyName="ابعاد الرؤية للاستشارات الهندسية"
        joinDate="04/05/2024"
      />
      <EmployeeCard
        currentUsers={6}
        maxUsers={10}
        price={99}
        daysLeft={4}
        storageLimit="10 جيجابايت"
      />
      <CompanyProfileTaps />
    </div>
  );
};

export default CompanyProfilePage;
