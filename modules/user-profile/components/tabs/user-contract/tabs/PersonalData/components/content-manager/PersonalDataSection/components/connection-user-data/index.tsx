import Can from "@/lib/permissions/client/Can";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import { ConnectionOTPCxtProvider } from "./context/ConnectionOTPCxt";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataEditForm2 from "./edit-mode-v2";
import UserProfileConnectionDataReview from "./preview-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ConnectionDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userConnectionDataLoading } = usePersonalDataTabCxt();

  return (
    <ConnectionOTPCxtProvider>
      <TabTemplate
        title={"بيانات الاتصال"}
        loading={userConnectionDataLoading}
        reviewMode={
          <Can check={[PERMISSIONS.profile.contactInfo.view]}>
            <UserProfileConnectionDataReview />
          </Can>
        }
        editMode={
          <Can check={[PERMISSIONS.profile.contactInfo.update]}>
            <UserProfileConnectionDataEditForm2 />
          </Can>
        }
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
        }}
      />
    </ConnectionOTPCxtProvider>
  );
}
