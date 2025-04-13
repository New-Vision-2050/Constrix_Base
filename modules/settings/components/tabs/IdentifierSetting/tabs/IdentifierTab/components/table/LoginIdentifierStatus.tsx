import { Switch } from "@/components/ui/switch";
import { apiClient } from "@/config/axios-config";
import { LoginIdentifier } from "@/modules/settings/types/LoginIdentifier";
import { useTableInstance } from "@/modules/table/store/useTableStore";
import { toast } from "sonner";

type PropsT = {
  identifier: LoginIdentifier;
};
export default function LoginIdentifierStatus({ identifier }: PropsT) {
  const { reloadTable } = useTableInstance("login-identifier-table");
  const handleChangeStatus = async () => {
    try {
      const response = await apiClient.post(
        `settings/identifier/make-default/${identifier.id}`
      );
      console.log("response-response", response);
      reloadTable();
      toast.success("Login way status changed successfully");
    } catch (error) {
      console.log("error in change login way status ::", error);
    }
  };

  
  return (
    <Switch
      checked={identifier.status == 1}
      onCheckedChange={handleChangeStatus}
    />
  );
}
