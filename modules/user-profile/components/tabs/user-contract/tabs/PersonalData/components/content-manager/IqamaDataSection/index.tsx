import UserIqamaBorderNumber from "./components/border-number";
import UserIqamaData from "./components/iqama-data";
import UserIqamaWorkLicenseData from "./components/work-license";

export default function IqamaDataSection() {
  return (
    <div className="flex flex-col gap-8">
      <UserIqamaBorderNumber />
      <UserIqamaData />
      <UserIqamaWorkLicenseData />
    </div>
  );
}
