import UserAddressSectionPreviewMode from "./preview-mode";
import UserAddressSectionEditMode from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function UserAddressSection() {
  const canEdit = can(PERMISSION_ACTIONS.UPDATE,  PERMISSION_SUBJECTS.PROFILE_ADDRESS_INFO) as boolean;
  // declare and define component state and vars
  const { handleRefetchUserContactData, userContactDataLoading } =
    useConnectionDataCxt();

  return (
    <TabTemplate
      title={"العنوان"}
      loading={userContactDataLoading}
      reviewMode={<UserAddressSectionPreviewMode />}
      editMode={<UserAddressSectionEditMode />}
      onChangeMode={() => {
        handleRefetchUserContactData();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} ,disabled:true},
          { title: "أنشاء طلب", onClick: () => {},disabled:true },
        ],
      }}
      canEdit={canEdit}
    />
  );
}
