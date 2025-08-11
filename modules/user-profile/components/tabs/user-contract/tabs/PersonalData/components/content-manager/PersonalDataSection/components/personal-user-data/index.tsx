import UserProfilePersonalDataEditForm from "./edit-mode";
import UserProfilePersonalDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export default function PersonalDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userPersonalDataLoading, handleRefreshPersonalData } =
    usePersonalDataTabCxt();
    const { can } = usePermissions();

  return (
     <>
     {
      can(PERMISSIONS.profile.personalInfo.view)&&<TabTemplate
      title="البيانات الشخصية"
      loading={userPersonalDataLoading}
      reviewMode={
          <UserProfilePersonalDataReview />
      }
      editMode={
          <UserProfilePersonalDataEditForm />
      }
      onChangeMode={() => {
        handleRefreshPersonalData();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {}},
          { title: "أنشاء طلب", onClick: () => {}},
        ],
        disabled: !can(PERMISSIONS.profile.personalInfo.update),
      }}
    />
     }
     
     </>
  );
}
