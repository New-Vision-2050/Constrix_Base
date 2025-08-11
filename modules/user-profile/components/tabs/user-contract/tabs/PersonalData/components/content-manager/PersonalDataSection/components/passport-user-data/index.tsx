import UserProfilePassportDataReview from "./preview-mode";
import UserProfilePassportDataEditForm from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export default function PassportDataSectionPersonalForm() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();
  const { can } = usePermissions();

  return (
    <Can check={[PERMISSIONS.profile.passportInfo.view]}>
      <TabTemplate
        title="البيانات جواز السفر"
        loading={userIdentityDataLoading}
        reviewMode={<UserProfilePassportDataReview />}
        editMode={<UserProfilePassportDataEditForm />}
        onChangeMode={() => {
          handleRefreshIdentityData();
        }}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can(PERMISSIONS.profile.passportInfo.update),
        }}
      />
    </Can>
  );
}
