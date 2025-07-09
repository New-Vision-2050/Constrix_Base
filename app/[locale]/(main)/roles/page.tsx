"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { useModal } from "@/hooks/use-modal";
import { statisticsConfig } from "@/modules/companies/components/statistics-config";
import RoleSheet from "@/modules/roles/components/RoleSheet";
import { rolesTableConfig } from "@/modules/roles/config/RolesTableConfig";
import { TableBuilder } from "@/modules/table";
import React, { useCallback, useState } from "react";

const RolesPages = () => {
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
  [handleOpen]
);

  const config = rolesTableConfig({handleOpenRolesSheet});
  
  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />
      <TableBuilder
        config={config}
        searchBarActions={
          <RoleSheet isEdit={isEdit} tableId={config.tableId} isOpen={isOpen} handleOpen={handleOpenRolesSheet} handleClose={handleCloseRolesSheet} selectedId={selectedId}/>
        }
      />
    </div>
  );
};

export default RolesPages;
