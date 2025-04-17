import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { UserActionsTabsList } from "./UserActionsTabsList";
import { UserActionsCxtProvider } from "./context";

export default function UserActionsTabs() {
  // declare and define component state and variables
  // declare and define component helper methods
  // return component ui.
  return (
    <UserActionsCxtProvider>
      <HorizontalTabs list={UserActionsTabsList} />
    </UserActionsCxtProvider>
  );
}