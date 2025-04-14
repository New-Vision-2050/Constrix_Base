import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import UserIcon from "@/public/icons/user";
import PersonalDataSection from "../components/content-manager/PersonalDataSection";
import LandmarkIcon from "@/public/icons/landmark";
import PhoneIcon from "@/public/icons/phone-icon";
import BackpackIcon from "@/public/icons/backpack";
import IqamaDataSection from "../components/content-manager/IqamaDataSection";
import BankingDataSection from "../components/content-manager/BankingDataSection";
import ConnectionDataSection from "../components/content-manager/connectionDataSection";

export const PersonalDataSections: UserProfileNestedTab[] = [
  {
    id: "contract-tab-personal-data-section",
    title: "البيانات الشخصية",
    icon: <UserIcon />,
    content: <PersonalDataSection />,
  },
  {
    id: "contract-tab-banking-data-section",
    title: "المعلومات البنكية",
    icon: <LandmarkIcon />,
    content: <BankingDataSection />,
  },
  {
    id: "contract-tab-connect-data-section",
    title: "معلومات الاتصال",
    icon: <PhoneIcon />,
    content: <ConnectionDataSection />,
  },
  {
    id: "contract-tab-iqama-data-section",
    icon: <BackpackIcon />,
    title: "معلومات الاقامة",
    content: <IqamaDataSection />,
  },
];
