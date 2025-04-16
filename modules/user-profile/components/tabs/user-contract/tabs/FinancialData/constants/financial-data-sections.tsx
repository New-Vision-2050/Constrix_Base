import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import GraduationCapIcon from "@/public/icons/graduation-cap";
import Salaries from "../components/salaries";

export const financialDataSections: UserProfileNestedTab[] = [
  {
    id: "financial-data-salaries",
    title: "الراتب",
    icon: <GraduationCapIcon />,
    content: <Salaries />,
  },
  {
    id: "financial-data-alternatives",
    title: "الامتيازات و البدلات",
    icon: <GraduationCapIcon />,
    content: <>الامتيازات و البدلات</>,
  },
];

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetFinancialDataSections = (props: PropsT) => {
  const { handleChangeActiveSection } = props;

  return financialDataSections?.map((btn) => ({
    ...btn,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
