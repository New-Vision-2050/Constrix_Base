import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import UserIcon from "@/public/icons/user";
import PersonalDataSection from "../components/content-manager/PersonalDataSection";
import LandmarkIcon from "@/public/icons/landmark";
import PhoneIcon from "@/public/icons/phone-icon";
import BackpackIcon from "@/public/icons/backpack";
import IqamaDataSection from "../components/content-manager/IqamaDataSection";
import BankingDataSection from "../components/content-manager/BankingDataSection";
import ConnectionDataSection from "../components/content-manager/connectionDataSection";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useTranslations } from "next-intl";

export const PersonalDataSections = (
  t: (key: string) => string
): UserProfileNestedTab[] => [
  {
    id: "contract-tab-personal-data-section",
    title: t("personalData"),
    icon: <UserIcon />,
    type: "info_company_user",
    content: <PersonalDataSection />,
  },
  {
    id: "contract-tab-banking-data-section",
    title: t("bankingData"),
    type: "bank_account",
    icon: <LandmarkIcon />,
    content: <BankingDataSection />,
  },
  {
    id: "contract-tab-connect-data-section",
    title: t("connectionData"),
    type: "contact_info",
    icon: <PhoneIcon />,
    content: <ConnectionDataSection />,
  },
  {
    id: "contract-tab-iqama-data-section",
    icon: <BackpackIcon />,
    type: "identity_info",
    title: t("iqamaData"),
    content: <IqamaDataSection />,
  },
];

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetPersonalDataSections = (props: PropsT) => {
  // declare and define component state and vars
  const { handleChangeActiveSection } = props;
  const { user, userDataStatus } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs.verticalLists.personalList");

  const identity = user?.country?.id === user?.company?.country_id;

  return PersonalDataSections(t)?.filter((ele) => {
    if (ele.id !== "contract-tab-iqama-data-section") return true;

    return !identity;
  })?.map((btn) => ({
    ...btn,
    valid: btn?.type
      ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
      : undefined,
    onClick: () => handleChangeActiveSection(btn),
  })) as UserProfileNestedTab[];
};
