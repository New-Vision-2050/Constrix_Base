import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";
import { ConnectionOTPCxtProvider } from "./context/ConnectionOTPCxt";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataReview from "./preview-mode";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";

export default function ConnectionDataSectionPersonalForm() {
  // declare and define component state and vars
  const { userConnectionDataLoading } = usePersonalDataTabCxt();

  return (
    <ConnectionOTPCxtProvider>
      <TabTemplate
        title={"البيانات الاتصال"}
        loading={userConnectionDataLoading}
        reviewMode={<UserProfileConnectionDataReview />}
        editMode={<UserProfileConnectionDataEditForm />}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {} },
            { title: "أنشاء طلب", onClick: () => {} },
          ],
        }}
      />
    </ConnectionOTPCxtProvider>
  );
}
