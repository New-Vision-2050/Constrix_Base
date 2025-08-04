import UserIqamaBorderNumberPreviewMode from "./preview-mode";
import UserIqamaBorderNumberEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function UserIqamaBorderNumber() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();

  return (
    <TabTemplate
      title={"بيانات رقم الحدود - الدخول"}
      loading={userIdentityDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.borderNumber.view]}>
          <UserIqamaBorderNumberPreviewMode />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.borderNumber.update]}>
          <UserIqamaBorderNumberEditMode />
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
