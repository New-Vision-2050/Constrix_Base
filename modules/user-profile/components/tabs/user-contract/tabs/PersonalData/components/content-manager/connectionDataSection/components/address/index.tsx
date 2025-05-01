import UserAddressSectionPreviewMode from "./preview-mode";
import UserAddressSectionEditMode from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";

export default function UserAddressSection() {
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
          { title: "طلباتي", onClick: () => {} },
          { title: "أنشاء طلب", onClick: () => {} },
        ],
      }}
    />
  );
}
