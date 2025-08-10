"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { statisticsConfig } from "@/modules/companies/components/statistics-config";
import UpdateRoleDrawer from "@/modules/roles/components/create-role/update-drawer";
import { rolesTableConfig } from "@/modules/roles/config/RolesTableConfig";
import { TableBuilder, useTableReload } from "@/modules/table";
import React, { useCallback, useState } from "react";

const RolesPages = () => {
  const [isOpen, handleOpen, handleClose] = useModal();
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  
  // Get table reload function
  const { reloadTable } = useTableReload("roles-table");

  const handleOpenRolesSheet = useCallback(
    ({ selectedId }: { selectedId?: string }) => {
      setSelectedId(selectedId);
      handleOpen();
    },
    [handleOpen]
  );

  const handleCloseRolesSheet = useCallback(() => {
    setSelectedId(undefined);
    handleClose();
  }, [handleClose]); // Fixed dependency - should be handleClose, not handleOpen

  // Function to handle successful form submission
  const handleFormSuccess = useCallback(() => {
    handleCloseRolesSheet();
    reloadTable(); // Reload the table data
  }, [handleCloseRolesSheet, reloadTable]);

  const config = rolesTableConfig({ handleOpenRolesSheet });

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />
      <TableBuilder
        config={config}
        searchBarActions={
          <>
            <Can check={[PERMISSIONS.role.create]}>
              <Button onClick={() => handleOpenRolesSheet({})}>انشاء</Button>
            </Can>

            <UpdateRoleDrawer
              onClose={handleCloseRolesSheet}
              open={isOpen}
              roleId={selectedId}
              onSuccess={handleFormSuccess} // Add success handler to reload table
              
            />
          </>
        }
      />
    </div>
  );
};

export default RolesPages;
