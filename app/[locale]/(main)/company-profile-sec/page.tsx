import CompanyFileTaps from "@/modules/company-profile/components/company-file/company-file-taps";
import CompanyHeader from "@/modules/company-profile/components/shared/company-header";
import CompanyProfileTaps from "@/modules/company-profile/components/shared/company-profile-taps";
import EmployeeCard from "@/modules/company-profile/components/shared/employee-card";
import PlanCard from "@/modules/company-profile/components/shared/plan-card";
import { User, Briefcase, DollarSign, Send, Lock } from "lucide-react";

const tabs = [
  {
    label: "ملف الشركة",
    icon: <User size={18} />,
    value: "company",
    component: <CompanyFileTaps />,
  },
  {
    label: "العملاء",
    icon: <Briefcase size={18} />,
    value: "clients",
  },
  {
    label: "البيانات المالية",
    icon: <DollarSign size={18} />,
    value: "finance",
  },
  { label: "الاجازات", icon: <Send size={18} />, value: "leaves" },
  {
    label: "اجراءات المستخدم",
    icon: <Lock size={18} />,
    value: "user-actions",
  },
];

const CompanyProfilePage = () => {
  return (
    <div className="px-8 space-y-7">
      <CompanyHeader
        companyName="ابعاد الرؤية للاستشارات الهندسية"
        joinDate="04/05/2024"
      />
      <div className="flex gap-6 rounded-lg p-4">
        <PlanCard
          currentUsers={6}
          maxUsers={10}
          price={99}
          daysLeft={4}
          storageLimit="10 جيجابايت"
        />
        <EmployeeCard />
      </div>
      <CompanyProfileTaps
        tabs={tabs}
        defaultValue="company"
        variant="primary"
      />
    </div>
  );
};

export default CompanyProfilePage;
