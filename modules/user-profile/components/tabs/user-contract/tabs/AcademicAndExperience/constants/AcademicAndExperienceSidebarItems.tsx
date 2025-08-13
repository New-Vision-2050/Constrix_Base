import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import LandmarkIcon from "@/public/icons/landmark";
import BackpackIcon from "@/public/icons/backpack";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import UserQualificationData from "../components/content-manager/components/qualification";
import ProfileBriefSummary from "../components/content-manager/components/brief-summary";
import UserExperiences from "../components/content-manager/components/experiences";
import UserCourses from "../components/content-manager/components/courses";
import UserCertifications from "../components/content-manager/components/certifications";
import UserCV from "../components/content-manager/components/user-cv";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useTranslations } from "next-intl";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export const AcademicAndExperienceSidebarItems = (
  t: (key: string) => string
): UserProfileNestedTab[] => {
  const { can } = usePermissions();
  const tabs: (UserProfileNestedTab & { show: boolean })[] = [
    {
      id: "contract-tab-academic-experience-qualification",
      title: t("qualification"),
      type: "qualification",
      icon: <GraduationCapIcon />,
      content: <UserQualificationData />,
      show: can([PERMISSIONS.profile.qualification.view]),
    },
    {
      id: "contract-tab-academic-experience-brief",
      title: t("summary"),
      type: "user_about",
      icon: <BackpackIcon />,
      content: <ProfileBriefSummary />,
      show: can([PERMISSIONS.profile.aboutMe.view]),
    },
    {
      id: "contract-tab-academic-experience-old-experience",
      title: t("experiences"),
      icon: <BackpackIcon />,
      type: "experience",
      content: <UserExperiences />,
      show: can([PERMISSIONS.profile.experience.view]),
    },
    {
      id: "contract-tab-academic-experience-courses",
      icon: <LandmarkIcon />,
      type: "educational_course",
      title: t("courses"),
      content: <UserCourses />,
      show: can([PERMISSIONS.profile.courses.view]),
    },
    {
      id: "contract-tab-academic-experience-certificates",
      icon: <GraduationCapIcon />,
      title: t("certifications"),
      type: "professional_certificate",
      content: <UserCertifications />,
      show: can([PERMISSIONS.profile.certificates.view]),
    },
    {
      id: "contract-tab-academic-experience-cv",
      icon: <BackpackIcon />,
      type: "biography",
      title: t("cv"),
      content: <UserCV />,
      show: can([PERMISSIONS.profile.cv.view]),
    },
  ];
  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};
type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetAcademicAndExperienceSidebarItems = (props: PropsT) => {
  // declare and define component state and vars
  const { handleChangeActiveSection } = props;
  const { userDataStatus } = useUserProfileCxt();
  const t = useTranslations(
    "UserProfile.tabs.verticalLists.academicAndExperienceList"
  );

  return AcademicAndExperienceSidebarItems(t)?.map((btn) => ({
    ...btn,
    valid: btn?.type
      ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
      : undefined,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
