'use client'
import { OrgStructureDepartmentsSettingsTableConfig } from './table-config';
import { useTableStore } from '@/modules/table/store/useTableStore';
import { TableBuilder } from '@/modules/table';
import { SheetFormBuilder } from '@/modules/form-builder';
import { Button } from '@/components/ui/button';
import { OrgStructureDepartmentsSettingsFormConfig } from './form-config';
import { can } from '@/hooks/useCan';
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from '@/modules/roles-and-permissions/permissions';
import CanSeeContent from '@/components/shared/CanSeeContent';

const OrgStructureDepartmentSetting = () => {

  const permissions = can(
    [PERMISSION_ACTIONS.LIST, PERMISSION_ACTIONS.CREATE],
    PERMISSION_SUBJECTS.ORGANIZATION_DEPARTMENT
  ) as {
    LIST: boolean;
    CREATE: boolean;
  };

  const config = OrgStructureDepartmentsSettingsTableConfig();

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
          <>
            {permissions.CREATE && (
              <div className="flex items-center gap-3">
                <SheetFormBuilder
                  config={OrgStructureDepartmentsSettingsFormConfig}
                  trigger={<Button>اضافة قسم</Button>}
                  onSuccess={handleFormSuccess}
                />{" "}
              </div>
            )}
          </>
        }
      />
    </CanSeeContent>
  );
}

export default OrgStructureDepartmentSetting
