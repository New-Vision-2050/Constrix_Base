import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileIdentityDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { useTranslations } from "next-intl";

export default function IdentityDataSectionPersonalForm() {
  // declare and define component state and vars
  const { handleRefreshIdentityData, userIdentityDataLoading } =
    usePersonalDataTabCxt();
  const { can } = usePermissions();
  const t = useTranslations("UserProfile.nestedTabs.identityData");
  const tActions = useTranslations("UserProfile.nestedTabs.commonActions");

  return (
    <Can check={[PERMISSIONS.userProfile.identity.view]}>
      <TabTemplate
        title={t("title")}
        loading={userIdentityDataLoading}
        reviewMode={
          // <Can check={[PERMISSIONS.profile.identityInfo.view]}>
          <UserProfileIdentityDataReview />
          // </Can>
        }
        editMode={
          // <Can check={[PERMISSIONS.profile.identityInfo.update]}>
          <UserProfileConnectionDataEditForm />
          // </Can>
        }
        onChangeMode={() => {
          handleRefreshIdentityData();
        }}
        settingsBtn={{
          items: [
            { title: tActions("myRequests"), onClick: () => {}, disabled: true },
            { title: tActions("createRequest"), onClick: () => {}, disabled: true },
          ],
          disabledEdit: !can(PERMISSIONS.userProfile.identity.update),
        }}
      />
    </Can>
  );
}
