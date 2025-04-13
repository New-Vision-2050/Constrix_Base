import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { BankingDataFormConfig } from "./config/BankingFormConfig";
import { Button } from "@/components/ui/button";

export default function BankingDataSection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h4 className="text-lg font-bold">البيانات البنكية</h4>
        <Button>اضافة حساب بنكي</Button>
      </div>
      <FormContent config={BankingDataFormConfig()} />
    </div>
  );
}
