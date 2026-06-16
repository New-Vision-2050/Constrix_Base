import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import type { TaskActionFormValues } from "../components/dialogs/AddTaskActionDialog";
import { fromApiConditionKey } from "./mapTaskActionToInternalProcedure";

export function mapInternalProcedureToFormValues(
  procedure: InternalProcedure,
): TaskActionFormValues {
  const formConditions: Record<string, boolean | number> = {};
  procedure.conditions?.forEach((condition) => {
    formConditions[fromApiConditionKey(condition.key)] = condition.value;
  });

  return {
    name: procedure.name,
    modelId: procedure.form,
    formConditions,
    appearBefore: procedure.appears_before_id ?? "",
    appearAfter: procedure.appears_after_id ?? "",
  };
}
