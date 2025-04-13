import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import LandmarkIcon from "@/public/icons/landmark";
import BackpackIcon from "@/public/icons/backpack";
import GraduationCapIcon from "@/public/icons/graduation-cap";

export const AcademicAndExperienceSidebarItems: UserProfileNestedTab[] = [
  {
    id: "contract-tab-academic-experience-qualification",
    title: "المؤهل",
    icon: <GraduationCapIcon />,
    content: <>المؤهل</>,
  },
  {
    id: "contract-tab-academic-experience-brief",
    title: "نبذه مختصرة",
    icon: <BackpackIcon />,
    content: <>نبذه مختصرة</>,
  },
  {
    id: "contract-tab-academic-experience-old-experience",
    title: "الخبرات السابقة",
    icon: <BackpackIcon />,
    content: <>الخبرات السابقة</>,
  },
  {
    id: "contract-tab-academic-experience-courses",
    icon: <LandmarkIcon />,
    title: "الكورسات التعليمية",
    content: <>الكورسات التعليمية</>,
  },
  {
    id: "contract-tab-academic-experience-certificates",
    icon: <GraduationCapIcon />,
    title: "الشهادات المهنية",
    content: <>الشهادات المهنية</>,
  },
  {
    id: "contract-tab-academic-experience-cv",
    icon: <BackpackIcon />,
    title: "السيرة الذاتية",
    content: <>السيرة الذاتية</>,
  },
];
