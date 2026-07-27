import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import type { ProceduresSettingsOuterTab } from "@/modules/hr-settings/tabs/procedures-settings";

export const DOCUMENT_SEQUENCE_PROCEDURE_TYPE = "project_procedure" as const;

function sortProcedures(procedures: InternalProcedure[]): InternalProcedure[] {
  return [...procedures]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const orderA = a.item.sort_order ?? a.index + 1;
      const orderB = b.item.sort_order ?? b.index + 1;
      if (orderA !== orderB) return orderA - orderB;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

/** Map GET internal-procedures (project_procedure) → outer tabs (name = tab label). */
export function mapInternalProceduresToOuterTabs(
  procedures: InternalProcedure[],
): ProceduresSettingsOuterTab[] {
  return sortProcedures(procedures).map((procedure, index) => ({
    id: index,
    type: DOCUMENT_SEQUENCE_PROCEDURE_TYPE,
    name: procedure.name || `procedure-${index}`,
    label: procedure.name || procedure.id,
    procedureId: procedure.id,
  }));
}
