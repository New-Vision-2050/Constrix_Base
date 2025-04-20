import { ConnectionOTPCxtProvider } from "./context/ConnectionOTPCxt";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataReview from "./preview-mode";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

export default function ConnectionDataSectionPersonalForm() {
  // declare and define component state and vars

  return (
    <ConnectionOTPCxtProvider>
      <TabTemplate
        title={"البيانات الاتصال"}
        reviewMode={<UserProfileConnectionDataReview />}
        editMode={<UserProfileConnectionDataEditForm />}
      />
    </ConnectionOTPCxtProvider>
  );
}
