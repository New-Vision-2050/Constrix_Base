"use client";
import CanSeeContent from "@/components/shared/CanSeeContent";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { useModal } from "@/hooks/use-modal";
import { can } from "@/hooks/useCan";
import { statisticsConfig } from "@/modules/companies/components/statistics-config";
import RoleSheet from "@/modules/roles-and-permissions/components/RoleSheet";
import { rolesTableConfig } from "@/modules/roles-and-permissions/config/RolesTableConfig";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import { TableBuilder } from "@/modules/table";
import React, { useCallback, useState } from "react";

const RolesPages = () => {
  const permissions = can([PERMISSION_ACTIONS.LIST , PERMISSION_ACTIONS.CREATE], [PERMISSION_SUBJECTS.ROLE]) as {
    LIST: boolean;
    CREATE: boolean;
  };
  const [isOpen, handleOpen, handleClose] = useModal();
  const [isEdit , setIsEdit] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string|undefined>(undefined)

const handleOpenRolesSheet = useCallback(
  ({ isEdit, selectedId }: { isEdit: boolean; selectedId?: string }) => {
    setIsEdit(isEdit);
    setSelectedId(selectedId);
    handleOpen();
  },
  [handleOpen]
);

const handleCloseRolesSheet = useCallback(
  () => {
    setIsEdit(false);
    setSelectedId(undefined);
    handleClose();
  },
  [handleClose]
);

  const config = rolesTableConfig({handleOpenRolesSheet});
  
  return (
    <CanSeeContent canSee={permissions.LIST}>
      <div className="px-8 space-y-7">
        <StatisticsRow config={statisticsConfig} />
        <TableBuilder
          config={config}
          searchBarActions={
            <>
              {permissions.CREATE && (
                <RoleSheet
                  isEdit={isEdit}
                  tableId={config.tableId}
                  isOpen={isOpen}
                  handleOpen={handleOpenRolesSheet}
                  handleClose={handleCloseRolesSheet}
                  selectedId={selectedId}
                />
              )}
            </>
          }
        />
      </div>
    </CanSeeContent>
  );
};

export default RolesPages;
