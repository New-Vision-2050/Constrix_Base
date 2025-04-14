import { Button } from "@/components/ui/button";
import BankSection from "./bank-data";
import { UserBankingDataCxtProvider } from "./context";

export default function BankingDataSection() {
  return (
    <UserBankingDataCxtProvider>
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h4 className="text-lg font-bold">البيانات البنكية</h4>
          <Button>اضافة حساب بنكي</Button>
        </div>
        <BankSection title="حساب بنكي 1" />
        <BankSection title="حساب بنكي 2" />
      </div>
    </UserBankingDataCxtProvider>
  );
}
