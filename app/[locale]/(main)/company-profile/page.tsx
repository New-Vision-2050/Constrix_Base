import CompanyHeader from "@/modules/company-profile/components/shared/company-header";

const CompanyProfilePage = () => {
  return (
    <div className="px-8 space-y-7">
      <CompanyHeader
        companyName="ابعاد الرؤية للاستشارات الهندسية"
        joinDate="04/05/2024"
      />
    </div>
  );
};

export default CompanyProfilePage;
