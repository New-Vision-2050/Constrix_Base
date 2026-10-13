import { TableBuilder } from "@/modules/table";
import { SheetFormBuilder } from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { getAdvancePolicyTableConfig } from "./components/AdvancePolicies/AdvancePolicyTableConfig";
import { getSetAdvancePolicyFormConfig } from "./components/AdvancePolicies/SetAdvancePolicyForm";

export default function HRSettingsAdvances() {
  const config = getAdvancePolicyTableConfig();
  const t = useTranslations("HRSettingsAdvances.policies");

  const handleOnSuccessFn = () => {
    useTableStore.getState().reloadTable(config.tableId);
  };

  return (
    <TableBuilder
      config={config}
      searchBarActions={
        <div className="flex items-center gap-3">
          <SheetFormBuilder
            config={getSetAdvancePolicyFormConfig(t, handleOnSuccessFn)}
            trigger={<Button>{t("addAdvancePolicy")}</Button>}
          />
        </div>
      }
    />
  );
}
