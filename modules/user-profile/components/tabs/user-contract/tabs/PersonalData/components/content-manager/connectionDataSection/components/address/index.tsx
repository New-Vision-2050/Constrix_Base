import UserAddressSectionPreviewMode from "./preview-mode";
import UserAddressSectionEditMode from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useTranslations } from "next-intl";

export default function UserAddressSection() {
  // declare and define component state and vars
  const { can } = usePermissions();
  const { handleRefetchUserContactData, userContactDataLoading } =
    useConnectionDataCxt();
  const t = useTranslations("UserProfile.nestedTabs.addressData");
  const tActions = useTranslations("UserProfile.nestedTabs.commonActions");

  return (
    <Can check={[PERMISSIONS.profile.addressInfo.view]}>
      <TabTemplate
        title={t("title")}
        loading={userContactDataLoading}
        reviewMode={<UserAddressSectionPreviewMode />}
        editMode={<UserAddressSectionEditMode />}
        onChangeMode={() => {
          handleRefetchUserContactData();
        }}
        settingsBtn={{
          items: [
            { title: tActions("myRequests"), onClick: () => {}, disabled: true },
            { title: tActions("createRequest"), onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can([PERMISSIONS.profile.addressInfo.update]),
        }}
      />
    </Can>
  );
}
