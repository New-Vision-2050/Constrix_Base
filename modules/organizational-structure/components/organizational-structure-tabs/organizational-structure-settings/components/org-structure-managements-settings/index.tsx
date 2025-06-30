'use client'
import { OrgStructureManagementsSettingsTableConfig } from './table-config';
import { useTableStore } from '@/modules/table/store/useTableStore';
import { TableBuilder } from '@/modules/table';
import { SheetFormBuilder } from '@/modules/form-builder';
import { Button } from '@/components/ui/button';
import { OrgStructureManagementsSettingsFormConfig } from './form-config';

const OrgStructureManagementSetting = () => {
    const config = OrgStructureManagementsSettingsTableConfig();

    const handleFormSuccess = () => {
      const tableStore = useTableStore.getState();
  
      tableStore.reloadTable(config.tableId);
  
      setTimeout(() => {
        tableStore.setLoading(config.tableId, false);
      }, 100);
    };
  
  
  return (
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={OrgStructureManagementsSettingsFormConfig}
              trigger={<Button>اضافة ادارة</Button>}
              onSuccess={handleFormSuccess}
            /> 
          </div>
        }
      />
  )
}

export default OrgStructureManagementSetting
