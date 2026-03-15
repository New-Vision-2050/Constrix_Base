import Can from "@/lib/permissions/client/Can";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import { ConnectionOTPCxtProvider } from "./context/ConnectionOTPCxt";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataEditForm2 from "./edit-mode-v2";
import UserProfileConnectionDataReview from "./preview-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useTranslations } from "next-intl";

export default function ConnectionDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userConnectionDataLoading } = usePersonalDataTabCxt();
  const { can } = usePermissions();
  const t = useTranslations("UserProfile.nestedTabs.connectionData");
  const tActions = useTranslations("UserProfile.nestedTabs.commonActions");

  return (
    <Can check={[PERMISSIONS.userProfile.contact.view]}>
      <ConnectionOTPCxtProvider>
        <TabTemplate
          title={t("title")}
          loading={userConnectionDataLoading}
          reviewMode={<UserProfileConnectionDataReview />}
          editMode={<UserProfileConnectionDataEditForm2 />}
          settingsBtn={{
            items: [
              { title: tActions("myRequests"), onClick: () => {}, disabled: true },
              { title: tActions("createRequest"), onClick: () => {}, disabled: true },
            ],
            disabledEdit: !can(PERMISSIONS.userProfile.contact.update),
          }}
        />
      </ConnectionOTPCxtProvider>
    </Can>
  );
}
