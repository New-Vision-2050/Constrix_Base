import { TableBuilder } from "@/modules/table";
import { getLeavePolicyCategoryTableConfig } from "./LeavePolicyCategoryTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetLeavePolicyCategoryFormConfig } from "./SetLeavePolicyCategoryForm";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useQueryClient } from "@tanstack/react-query";
import { LEAVE_POLICY_CATEGORIES_OPTIONS_QUERY_KEY } from "@/modules/hr-settings-vacations/hooks/useLeavePolicyCategories";

export default function LeavePolicyCategories() {
  const config = getLeavePolicyCategoryTableConfig();
  const t = useTranslations("HRSettingsVacations.leavePolicyCategories.table");
  const queryClient = useQueryClient();

  const handleOnSuccessFn = () => {
    useTableStore.getState().reloadTable(config.tableId);
    queryClient.invalidateQueries({
      queryKey: LEAVE_POLICY_CATEGORIES_OPTIONS_QUERY_KEY,
    });
  };

  return (
    <Can check={[PERMISSIONS.vacations.settings.leavePolicyCategory.list]}>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <Can
              check={[PERMISSIONS.vacations.settings.leavePolicyCategory.create]}
            >
              <SheetFormBuilder
                config={getSetLeavePolicyCategoryFormConfig(t, handleOnSuccessFn)}
                trigger={<Button>{t("addCategory")}</Button>}
              />
            </Can>
          </div>
        }
      />
    </Can>
  );
}
