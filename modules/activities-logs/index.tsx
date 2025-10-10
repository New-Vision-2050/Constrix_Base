import ActivitiesLogsEntryPoint from "./components/entry-point";
import { ActivitiesLogsCxtProvider } from "./context/ActivitiesLogsCxt";

export default function ActivitiesLogsModule() {
  return (
    <ActivitiesLogsCxtProvider>
      <div className="flex flex-col gap-4 p-6">
        <ActivitiesLogsEntryPoint />
      </div>
    </ActivitiesLogsCxtProvider>
  );
}
