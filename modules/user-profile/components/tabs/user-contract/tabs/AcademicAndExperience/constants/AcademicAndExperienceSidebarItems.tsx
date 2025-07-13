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
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export const AcademicAndExperienceSidebarItems = (
  t: (key: string) => string
): UserProfileNestedTab[] => {
  const canViewQualification = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_QUALIFICATION);
  const canViewAboutMe = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_ABOUT_ME);
  const canViewExperience = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_EXPERIENCE);
  const canViewCourses = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_COURSES);
  const canViewCertificates = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_CERTIFICATES);
  const canViewCV = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_CV);

  return [
    ...(canViewQualification ? [{
      id: "contract-tab-academic-experience-qualification",
      title: t("qualification"),
      type: "qualification",
      icon: <GraduationCapIcon />,
      content: <UserQualificationData />,
  }] : []),
  ...(canViewAboutMe ? [{
    id: "contract-tab-academic-experience-brief",
    title: t("summary"),
    type: "user_about",
    icon: <BackpackIcon />,
    content: <ProfileBriefSummary />,
  }] : []),
  ...(canViewExperience ? [{
    id: "contract-tab-academic-experience-old-experience",
    title: t("experiences"),
    icon: <BackpackIcon />,
    type: "experience",
    content: <UserExperiences />,
  }] : []),
    ...(canViewCourses ? [{
      id: "contract-tab-academic-experience-courses",
      icon: <LandmarkIcon />,
      type: "educational_course",
      title: t("courses"),
      content: <UserCourses />,
    }] : []),
  ...(canViewCertificates ? [{
    id: "contract-tab-academic-experience-certificates",
    icon: <GraduationCapIcon />,
    title: t("certifications"),
    type: "professional_certificate",
    content: <UserCertifications />,
  }] : []),
  ...(canViewCV ? [{
    id: "contract-tab-academic-experience-cv",
    icon: <BackpackIcon />,
    type: "biography",
    title: t("cv"),
    content: <UserCV />,
  }] : []),
]
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
