import VacationsEntryPoint from "./components/entry-point";
import { HRVacationCxtProvider } from "./context/hr-vacation-cxt";

export default function HRSettingsVacations() {
  return (
    <HRVacationCxtProvider>
      <VacationsEntryPoint />
    </HRVacationCxtProvider>
  );
}
