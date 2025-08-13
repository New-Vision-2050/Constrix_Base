import { SystemTab } from "@/modules/settings/types/SystemTab";
import UserContractTab from "../components/tabs/user-contract";
import UserProfileTab from "../components/tabs/user-profile";
import UserActionsTabs from "../components/tabs/user-actions";
import { UserIcon, Users } from "lucide-react";
import BackpackIcon from "@/public/icons/backpack";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export const useGetEditModeTabsList = (
  t: (key: string) => string
): SystemTab[] => {
  const { can } = usePermissions();

  const tabs: (SystemTab & { show: boolean })[] = [
    {
      id: "edit-mode-tabs-profile",
      title: t("profile"),
      icon: <UserIcon />,
      content: <UserProfileTab />,
      show: true,
    },
    {
      id: "edit-mode-tabs-contract",
      title: t("contract"),
      icon: <Users />,
      content: <UserContractTab />,
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
        PERMISSIONS.profile.qualification.view,
        PERMISSIONS.profile.aboutMe.view,
        PERMISSIONS.profile.experience.view,
        PERMISSIONS.profile.courses.view,
        PERMISSIONS.profile.certificates.view,
        PERMISSIONS.profile.cv.view,
        PERMISSIONS.profile.contractWork.view,
        PERMISSIONS.profile.jobOffer.view,
        PERMISSIONS.profile.employmentInfo.view,
        PERMISSIONS.profile.privileges.view,
        PERMISSIONS.profile.salaryInfo.view,
      ]),
    },
    {
      id: "edit-mode-tabs-attendance",
      title: t("attendance"),
      icon: <BackpackIcon />,
      content: <>سياسة الحضور</>,
      show: true,
    },
    {
      id: "edit-mode-tabs-logs",
      title: t("usersActions"),
      icon: <BackpackIcon />,
      content: <UserActionsTabs />,
      show: true,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};
