import Can from "@/lib/permissions/client/Can";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import { ConnectionOTPCxtProvider } from "./context/ConnectionOTPCxt";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataEditForm2 from "./edit-mode-v2";
import UserProfileConnectionDataReview from "./preview-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

export default function ConnectionDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userConnectionDataLoading } = usePersonalDataTabCxt();
  const { can } = usePermissions();
  
  return (
    <>
    {
      can(PERMISSIONS.profile.contactInfo.view)&&<ConnectionOTPCxtProvider>
      <TabTemplate
        title={"بيانات الاتصال"}
        loading={userConnectionDataLoading}
        reviewMode={
            <UserProfileConnectionDataReview />
        }
        editMode={
            <UserProfileConnectionDataEditForm2 />
        }
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
          ],
          disabled: !can(PERMISSIONS.profile.contactInfo.update),
        }}
      />
    </ConnectionOTPCxtProvider>
    }
    </>
      
  );
}
