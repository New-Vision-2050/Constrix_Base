import UserStatusEntryPoint from "./components/entry-point";
import { UserStatusCxtProvider } from "./context";

export default function UserStatusTab() {
  return (
    <UserStatusCxtProvider>
      <UserStatusEntryPoint />
    </UserStatusCxtProvider>
  );
}
