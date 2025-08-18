// TODO: import tabs
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import getHRSettingsVacationsTabs from "../config/VacationsNestedTabs";

export default function VacationsEntryPoint() {
  // TODO: declare and define variables
  const tabs = getHRSettingsVacationsTabs();
  // TODO: use tabs
  return (
    <div className="flex flex-col w-full">
      <HorizontalTabs list={tabs} bgStyleApproach={true} additionalClassiess="justify-start"/>
    </div>
  );
}
