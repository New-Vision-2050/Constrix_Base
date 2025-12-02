import { SystemTab } from "@/modules/settings/types/SystemTab";
import PersonalDataTab from "../tabs/PersonalData/PersonalData";
import AcademicAndExperience from "../tabs/AcademicAndExperience";
import FunctionalAndContractualData from "../tabs/FunctionalAndContractualData";
import FinancialBenefits from "../tabs/FinancialData";
import { CircleDollarSign, GraduationCap, UserIcon } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const GetUserContractTabsList = (
  t: (key: string) => string,
  userId: string,
  companyId: string
): SystemTab[] => {
  // declare and define component state and variables
  const { can } = usePermissions();

  const tabs: (SystemTab & { show: boolean })[] = [
    {
      id: "user-contract-tab-personal-data",
      title: t("personalTab"),
      icon: <UserIcon />,
      content: <PersonalDataTab userId={userId} companyId={companyId} />,
      show: can([
        PERMISSIONS.profile.personalInfo.view,
        PERMISSIONS.profile.passportInfo.view,
        PERMISSIONS.userProfile.contact.view,
        PERMISSIONS.userProfile.identity.view,
        PERMISSIONS.profile.bankInfo.view,
        PERMISSIONS.profile.contactInfo.view,
        PERMISSIONS.profile.addressInfo.view,
        PERMISSIONS.profile.maritalStatus.view,
        PERMISSIONS.profile.socialMedia.view,
        PERMISSIONS.profile.residenceInfo.view,
        PERMISSIONS.profile.borderNumber.view,
        PERMISSIONS.profile.workLicense.view,
      ]),
    },
    {
      id: "user-contract-tab-academic-experience",
      title: t("academicAndExperience"),
      icon: <GraduationCap />,
      content: <AcademicAndExperience />,
      show: can([
        PERMISSIONS.profile.qualification.view,
        PERMISSIONS.profile.aboutMe.view,
        PERMISSIONS.profile.experience.view,
        PERMISSIONS.profile.courses.view,
        PERMISSIONS.profile.certificates.view,
        PERMISSIONS.profile.cv.view,
      ]),
    },
    {
      id: "user-contract-tab-job-contract",
      title: t("employmentAndContractalData"),
      icon: <BackpackIcon />,
      content: <FunctionalAndContractualData />,
      show: can([
        PERMISSIONS.profile.contractWork.view,
        PERMISSIONS.profile.jobOffer.view,
        PERMISSIONS.profile.employmentInfo.view,
      ]),
    },
    {
      id: "user-contract-tab-financial",
      title: t("financialPrivileges"),
      icon: <CircleDollarSign />,
      content: <FinancialBenefits />,
      show: can([
        PERMISSIONS.profile.privileges.view,
        PERMISSIONS.profile.salaryInfo.view,
      ]),
    },
    {
      id: "user-contract-tab-contract-management",
      title: t("contractManagement"),
      icon: <BackpackIcon />,
      content: <>ادارة العقد</>,
      show: false,
    },
  ];

  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};
