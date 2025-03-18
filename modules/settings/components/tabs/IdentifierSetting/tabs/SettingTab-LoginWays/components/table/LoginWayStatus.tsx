import { Switch } from "@/components/ui/switch";
import { LoginWay } from "@/modules/settings/types/LoginWay";

type PropsT = {
  loginWay: LoginWay;
};
export default function LoginWayStatus({ loginWay }: PropsT) {
  return <Switch />;
}
