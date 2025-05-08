import { SheetFormBuilder } from "@/modules/form-builder";
import CompanyStructureEntryPoint from "./components/entry-point";
import { ManagementsStructureCxtProvider } from "./context";
import { GetOrgStructureManagementFormConfig } from "./set-management-form";
import { Button } from "@/components/ui/button";

export default function ManagementsStructure() {
  return (
    <ManagementsStructureCxtProvider>
      
      <SheetFormBuilder
        config={GetOrgStructureManagementFormConfig()}
        trigger={<Button>اضافة الأدارة</Button>}
      />

      <CompanyStructureEntryPoint />
      
    </ManagementsStructureCxtProvider>
  );
}
