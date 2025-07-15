'use client'
import { OrgStructureManagementsSettingsTableConfig } from './table-config';
import { useTableStore } from '@/modules/table/store/useTableStore';
import { TableBuilder } from '@/modules/table';
import { SheetFormBuilder } from '@/modules/form-builder';
import { Button } from '@/components/ui/button';
import { OrgStructureManagementsSettingsFormConfig } from './form-config';
import { can } from '@/hooks/useCan';
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from '@/modules/roles-and-permissions/permissions';
import CanSeeContent from '@/components/shared/CanSeeContent';

const OrgStructureManagementSetting = () => {
        const permissions = can(
          [PERMISSION_ACTIONS.LIST, PERMISSION_ACTIONS.CREATE],
          PERMISSION_SUBJECTS.ORGANIZATION_MANAGEMENT
        ) as {
          LIST: boolean;
          CREATE: boolean;
        };
    const config = OrgStructureManagementsSettingsTableConfig();

    const handleFormSuccess = () => {
      const tableStore = useTableStore.getState();
  
      tableStore.reloadTable(config.tableId);
  
      setTimeout(() => {
        tableStore.setLoading(config.tableId, false);
      }, 100);
    };
  
  
  return (
    <CanSeeContent canSee={permissions.LIST}>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            {permissions.CREATE && (
              <SheetFormBuilder
                config={OrgStructureManagementsSettingsFormConfig}
                trigger={<Button>اضافة ادارة</Button>}
                onSuccess={handleFormSuccess}
              />
            )}
          </div>
        }
      />
    </CanSeeContent>
  );
}

export default OrgStructureManagementSetting
