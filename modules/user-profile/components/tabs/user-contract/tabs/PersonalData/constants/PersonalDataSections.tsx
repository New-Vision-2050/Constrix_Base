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
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const PersonalDataSections = (
  t: (key: string) => string
): UserProfileNestedTab[] => {
  // declare and define component state and vars
  const shownTabs: string[] = [];
  const { can } = usePermissions();

  if (can(PERMISSIONS.profile.personalInfo.view))
    shownTabs.push("contract-tab-personal-data-section");
  if (can(PERMISSIONS.profile.bankInfo.view))
    shownTabs.push("contract-tab-banking-data-section");
  if (can(PERMISSIONS.profile.contactInfo.view))
    shownTabs.push("contract-tab-connect-data-section");
  // if(can(Object.values(PERMISSIONS.profile.identityInfo.view)))
  //   shownTabs.push("contract-tab-iqama-data-section");

  const tabs = [
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

  return tabs.filter((ele) => shownTabs.includes(ele.id));
};

type PropsT = {
  handleChangeActiveSection: (section: UserProfileNestedTab) => void;
};

export const GetPersonalDataSections = (props: PropsT) => {
  // declare and define component state and vars
  const { handleChangeActiveSection } = props;
  const { user, userDataStatus } = useUserProfileCxt();
  const t = useTranslations("UserProfile.tabs.verticalLists.personalList");

  const identity = user?.country?.id === user?.company?.country_id;

  return PersonalDataSections(t)
    ?.filter((ele) => {
      if (ele.id !== "contract-tab-iqama-data-section") return true;

      return !identity;
    })
    ?.map((btn) => ({
      ...btn,
      valid: btn?.type
        ? userDataStatus?.[btn?.type as keyof typeof userDataStatus]
        : undefined,
      onClick: () => handleChangeActiveSection(btn),
    })) as UserProfileNestedTab[];
};
