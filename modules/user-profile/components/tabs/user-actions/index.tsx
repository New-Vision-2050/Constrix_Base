import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useUserActionsTabsList } from "./UserActionsTabsList";
import { UserActionsCxtProvider } from "./context";

export default function UserActionsTabs() {
  // declare and define component state and variables
  const userActionsTabs = useUserActionsTabsList();
  
  // declare and define component helper methods
  // return component ui.
  return (
    <UserActionsCxtProvider>
      <HorizontalTabs list={userActionsTabs} />
    </UserActionsCxtProvider>
  );
}