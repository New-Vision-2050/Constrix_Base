import MainUserConnectionInfoSectionPreview from "./preview-mode/MainUserConnectionInfoSectionPreview";
import MainUserConnectionInfoSectionEdit from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function MainUserConnectionInfoSection() {
  // declare and define component state and vars
  const { handleRefetchUserContactData, userContactDataLoading } =
    useConnectionDataCxt();

  return (
    <TabTemplate
      title={"بيانات الاتصال"}
      loading={userContactDataLoading}
      reviewMode={
        <Can check={[PERMISSIONS.profile.contactInfo.view]}>
          <MainUserConnectionInfoSectionPreview />
        </Can>
      }
      editMode={
        <Can check={[PERMISSIONS.profile.contactInfo.update]}>
          <MainUserConnectionInfoSectionEdit />
        </Can>
      }
      onChangeMode={() => {
        handleRefetchUserContactData();
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
