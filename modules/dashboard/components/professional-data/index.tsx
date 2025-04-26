import RegularList from "@/components/shared/RegularList";
import UserInformationCardLayout from "../UserInformationCardLayout";
import { ProfessionalT } from "@/modules/user-profile/components/tabs/user-contract/tabs/FunctionalAndContractualData/api/get-professinal-data";
import { checkString } from "@/utils/check-string";

const getProfessionalDataItems = (data?: ProfessionalT): string[] => {
  if (!data) return [];
  return [
    `الفرع: ${checkString(data?.branch?.name)}`,
    `الأدارة: ${checkString(data?.management?.name)}`,
    `القسم: ${checkString(data?.department?.name)}`,
    `نوع الوظيفة: ${checkString(data?.job_type?.name)}`,
    `المسمى الوظيفي: ${checkString(data?.job_title)}`,
    `الرقم الوظيفي: ${checkString(data?.job_code)}`,
  ];
};

type PropsT = {
  data?: ProfessionalT | undefined;
};
export default function UserProfileProfessionalData({ data }: PropsT) {
  return (
    <UserInformationCardLayout title="البيانات المهنية">
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
