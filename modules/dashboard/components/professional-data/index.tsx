import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import { ProfessionalT } from "@/modules/user-profile/components/tabs/user-contract/tabs/FunctionalAndContractualData/api/get-professinal-data";
import { checkString } from "@/utils/check-string";
import { useTranslations } from "next-intl";

const getProfessionalDataItems = (data?: ProfessionalT): string[] => {
  const t = useTranslations("UserProfile.professionalData");
  if (!data) return [];
  return [
    `${t("branch")}: ${checkString(data?.branch?.name)}`,
    `${t("management")}: ${checkString(data?.management?.name)}`,
    `${t("department")}: ${checkString(data?.department?.name)}`,
    `${t("job_type")}: ${checkString(data?.job_type?.name)}`,
    `${t("job_title")}: ${checkString(data?.job_title?.name)}`,
    `${t("job_code")}: ${checkString(data?.job_code)}`,
  ];
};

type PropsT = {
  data?: ProfessionalT | undefined;
};
export default function UserProfileProfessionalData({ data }: PropsT) {
  const t = useTranslations("UserProfile.professionalData");
  return (
    <UserInformationCardLayout title={t("title")}>
      <RegularList<string, "userProfessionalItemData">
        sourceName="userProfessionalItemData"
        items={getProfessionalDataItems(data)}
        keyPrefix="user-profile-professional-data"
        ItemComponent={SigleItem}
      />
    </UserInformationCardLayout>
  );
}

const SigleItem = ({
  userProfessionalItemData,
}: {
  userProfessionalItemData: string;
}) => {
  return <p className="font-md my-1">{userProfessionalItemData}</p>;
};
