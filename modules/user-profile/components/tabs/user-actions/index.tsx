import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { UserActionsTabsList } from "./UserActionsTabsList";
import { UserActionsCxtProvider } from "./context";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

export default function UserActionsTabs() {
  // declare and define component state and variables
  const { tab2 } = useUserProfileCxt();
  // declare and define component helper methods
  // return component ui.
  return (
    <UserActionsCxtProvider>
      <HorizontalTabs
        list={UserActionsTabsList}
        defaultValue={tab2 !== null ? tab2 : undefined}
      />
    </UserActionsCxtProvider>
  );
}
