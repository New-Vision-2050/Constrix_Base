import UserAddressSectionPreviewMode from "./preview-mode";
import UserAddressSectionEditMode from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function UserAddressSection() {
  // declare and define component state and vars
  const { handleRefetchUserContactData } = useConnectionDataCxt();

  return (
    <TabTemplate
      title={"العنوان"}
      reviewMode={<UserAddressSectionPreviewMode />}
      editMode={<UserAddressSectionEditMode />}
      onChangeMode={() => {
        handleRefetchUserContactData();
      }}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} },
          { title: "أنشاء طلب", onClick: () => {} },
        ],
      }}
    />
  );
}
