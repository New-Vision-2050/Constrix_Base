import MainUserConnectionInfoSectionPreview from "./preview-mode/MainUserConnectionInfoSectionPreview";
import MainUserConnectionInfoSectionEdit from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";

export default function MainUserConnectionInfoSection() {
  // declare and define component state and vars
  const { handleRefetchUserContactData, userContactDataLoading } =
    useConnectionDataCxt();

  return (
    <TabTemplate
      title={"البيانات الاتصال"}
      loading={userContactDataLoading}
      reviewMode={<MainUserConnectionInfoSectionPreview />}
      editMode={<MainUserConnectionInfoSectionEdit />}
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
