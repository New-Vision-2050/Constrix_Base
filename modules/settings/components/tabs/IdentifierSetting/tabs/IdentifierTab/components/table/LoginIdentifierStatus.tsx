import { Switch } from "@/components/ui/switch";
import { LoginIdentifier } from "@/modules/settings/types/LoginIdentifier";

type PropsT = {
  identifier: LoginIdentifier;
};
export default function LoginIdentifierStatus({ identifier }: PropsT) {
  return <Switch />;
}
