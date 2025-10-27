'use client'
import { OrgStructureDepartmentsSettingsTableConfig } from './table-config';
import { useTableStore } from '@/modules/table/store/useTableStore';
import { TableBuilder } from '@/modules/table';
import { SheetFormBuilder } from '@/modules/form-builder';
import { Button } from '@/components/ui/button';
import { OrgStructureDepartmentsSettingsFormConfig } from './form-config';
import Can from '@/lib/permissions/client/Can';
import { PERMISSIONS } from '@/lib/permissions/permission-names';
import { usePermissions } from '@/lib/permissions/client/permissions-provider';

const OrgStructureDepartmentSetting = () => {
  const {can} = usePermissions()
  const config = OrgStructureDepartmentsSettingsTableConfig();

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
          <Can check={[PERMISSIONS.organization.department.create]}>
          <SheetFormBuilder
            config={OrgStructureDepartmentsSettingsFormConfig}
            trigger={<Button>اضافة قسم</Button>}
            onSuccess={handleFormSuccess}
          />
          </Can>
        </div>
      }
    />
  )
}

export default OrgStructureDepartmentSetting
