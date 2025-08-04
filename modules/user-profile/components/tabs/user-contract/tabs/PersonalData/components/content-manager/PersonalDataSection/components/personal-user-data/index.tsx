import UserProfilePersonalDataEditForm from "./edit-mode";
import UserProfilePersonalDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function PersonalDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userPersonalDataLoading, handleRefreshPersonalData } =
    usePersonalDataTabCxt();

  return (
    <TabTemplate
      title="البيانات الشخصية"
      loading={userPersonalDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.personalInfo.view]}>
          <UserProfilePersonalDataReview />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.personalInfo.update]}>
          <UserProfilePersonalDataEditForm />
        </Can>
      }
      onChangeMode={() => {
        handleRefreshPersonalData();
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
