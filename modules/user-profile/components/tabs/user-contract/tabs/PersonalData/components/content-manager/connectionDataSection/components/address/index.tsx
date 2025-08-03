import UserAddressSectionPreviewMode from "./preview-mode";
import UserAddressSectionEditMode from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function UserAddressSection() {
  // declare and define component state and vars
  const { handleRefetchUserContactData, userContactDataLoading } =
    useConnectionDataCxt();

  return (
    <TabTemplate
      title={"العنوان"}
      loading={userContactDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.addressInfo.view]}>
          <UserAddressSectionPreviewMode />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.addressInfo.update]}>
          <UserAddressSectionEditMode />
        </Can>
      }
      onChangeMode={() => {
        handleRefetchUserContactData();
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
