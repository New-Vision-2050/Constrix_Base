import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileIdentityDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function IdentityDataSectionPersonalForm() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"البيانات الهوية"}
      loading={userIdentityDataLoading}
      reviewMode={
        // <Can check={[PERMISSIONS.profile.identityInfo.view]}>
        <UserProfileIdentityDataReview />
        // </Can>
      }
      editMode={
        // <Can check={[PERMISSIONS.profile.identityInfo.update]}>
        <UserProfileConnectionDataEditForm />
        // </Can>
      }
      onChangeMode={() => {
        handleRefreshIdentityData();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {}, disabled: true },
          { title: "أنشاء طلب", onClick: () => {}, disabled: true },
        ],
      }}
    />
  );
}
