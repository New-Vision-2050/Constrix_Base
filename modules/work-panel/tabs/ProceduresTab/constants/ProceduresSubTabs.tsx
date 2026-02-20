import { SystemTab } from "@/modules/settings/types/SystemTab";
import { 
  IdCard, 
  FileText, 
  Users, 
  Building2, 
  Calendar, 
  Heart, 
  ClipboardList,
  Database
} from "lucide-react";
import ExpiredIDsContent from "../tabs/ExpiredIDsContent";
import ExpiredWorkPermitsContent from "../tabs/ExpiredWorkPermitsContent";
import EmployeeProceduresContent from "../tabs/EmployeeProceduresContent";
import ExpiredEngineeringLicensesContent from "../tabs/ExpiredEngineeringLicensesContent";
import LeaveBalancesContent from "../tabs/LeaveBalancesContent";
import MedicalInsuranceContent from "../tabs/MedicalInsuranceContent";
import EmployeeRequestsManagementContent from "../tabs/EmployeeRequestsManagementContent";
import ProjectDataTab from "@/modules/work-panel/components/ProjectDataTab";

export const GetProceduresSubTabs = (
  t: (key: string) => string
): SystemTab[] => {
  const tabs: SystemTab[] = [
    {
      id: "procedures-expired-ids",
      title: t("expiredIDs"),
      icon: <IdCard />,
      content: <ExpiredIDsContent />,
    },
    {
      id: "procedures-expired-work-permits",
      title: t("expiredWorkPermits"),
      icon: <FileText />,
      content: <ExpiredWorkPermitsContent />,
    },
    {
      id: "procedures-employee-procedures",
      title: t("employeeProcedures"),
      icon: <Users />,
      content: <EmployeeProceduresContent />,
    },
    {
      id: "procedures-expired-engineering-licenses",
      title: t("expiredEngineeringBodies"),
      icon: <Building2 />,
      content: <ExpiredEngineeringLicensesContent />,
    },
    {
      id: "procedures-leave-balances",
      title: t("leaveBalances"),
      icon: <Calendar />,
      content: <LeaveBalancesContent />,
    },
    {
      id: "procedures-medical-insurance",
      title: t("medicalInsurance"),
      icon: <Heart />,
      content: <MedicalInsuranceContent />,
    },
    {
      id: "procedures-employee-requests",
      title: t("employeeRequests"),
      icon: <ClipboardList />,
      content: <EmployeeRequestsManagementContent />,
    },
    {
      id: "procedures-project-data",
      title: t("projectData"),
      icon: <Database />,
      content: <ProjectDataTab />,
    },
  ];

  return tabs;
};

