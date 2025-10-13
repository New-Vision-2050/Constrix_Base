import Can from "@/lib/permissions/client/Can";
import ActivitiesLogsEntryPoint from "./components/entry-point";
import { ActivitiesLogsCxtProvider } from "./context/ActivitiesLogsCxt";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ActivitiesLogsModule() {
  return (
    <ActivitiesLogsCxtProvider>
      <div className="flex flex-col gap-4 p-6">
        <Can check={[PERMISSIONS.activityLogs.list]}>
          <ActivitiesLogsEntryPoint />
        </Can>
      </div>
    </ActivitiesLogsCxtProvider>
  );
}
