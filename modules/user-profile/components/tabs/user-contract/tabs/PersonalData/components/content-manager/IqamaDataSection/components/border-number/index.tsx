import UserIqamaBorderNumberPreviewMode from "./preview-mode";
import UserIqamaBorderNumberEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export default function UserIqamaBorderNumber() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();
  const { can } = usePermissions();

  return (
    <Can check={[PERMISSIONS.profile.borderNumber.view]}>
      <TabTemplate
        title={"بيانات رقم الحدود - الدخول"}
        loading={userIdentityDataLoading}
        reviewMode={<UserIqamaBorderNumberPreviewMode />}
        editMode={<UserIqamaBorderNumberEditMode />}
        onChangeMode={() => {
          handleRefreshIdentityData();
        }}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can([PERMISSIONS.profile.borderNumber.update]),
        }}
      />
    </Can>
  );
}
