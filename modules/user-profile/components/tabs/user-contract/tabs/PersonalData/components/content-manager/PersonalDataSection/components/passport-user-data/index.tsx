import UserProfilePassportDataReview from "./preview-mode";
import UserProfilePassportDataEditForm from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function PassportDataSectionPersonalForm() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();

  return (
    <TabTemplate
      title="البيانات جواز السفر"
      loading={userIdentityDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.passportInfo.view]}>
          <UserProfilePassportDataReview />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.passportInfo.update]}>
          <UserProfilePassportDataEditForm />
        </Can>
      }
      onChangeMode={() => {
        handleRefreshIdentityData();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} ,disabled:true},
          { title: "أنشاء طلب", onClick: () => {},disabled:true },
        ],
      }}
    />
  );
}
