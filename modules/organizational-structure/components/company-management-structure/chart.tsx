"use client";
import { Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { OrgChartNode } from "@/types/organization";
import { SheetFormBuilder, useSheetForm } from "@/modules/form-builder";
import useManagementsTreeData from "@/modules/organizational-structure/hooks/useManagementsTreeData";
import OrganizationChart from "@/modules/organizational-structure/org-chart/components/organization-chart";
import { GetOrgStructureManagementFormConfig } from "./set-management-form";
import { useManagementsStructureCxt } from "./ManagementsStructureCxt";

type PropsT = {
  branchId: string | number;
};

const BranchManagementsStructure = (props: PropsT) => {
  const { branchId } = props;
  const [isEdit, setIsEdit] = useState(false);
  const {
    isUserCompanyOwner,
    selectedNode,
    companyOwnerId,
    handleStoreSelectedNode,
  } = useManagementsStructureCxt();
  const config = useMemo(() => {
    return GetOrgStructureManagementFormConfig({
      isEdit,
      onClose,
      branchId,
      selectedNode,
      isUserCompanyOwner,
      companyOwnerId,
    });
  }, [isUserCompanyOwner, companyOwnerId, selectedNode, branchId, isEdit]);
  const { openSheet, isOpen, closeSheet } = useSheetForm({ config });
  const {
    data: orgData,
    isLoading,
    error,
    refetch: refreshOrgChart,
  } = useManagementsTreeData(branchId);
  const onAddBtnClick = useCallback((node: OrgChartNode) => {
    setIsEdit(false);
    handleStoreSelectedNode(node);
    openSheet();
  }, []);

  function onClose() {
    refreshOrgChart();
    closeSheet();
  }

  const onEditBtnClick = useCallback((node: OrgChartNode) => {
    setIsEdit(true);
    handleStoreSelectedNode(node);
    openSheet();
  }, []);

  return (
    <main className="flex-grow md:max-w-[calc(100vw-580px)]">
      <SheetFormBuilder
        isOpen={isOpen}
        config={config}
        onOpenChange={(open) => (open ? openSheet() : closeSheet())}
      />

      {isLoading && (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ltr:ml-2 rtl:mr-2 text-lg text-gray-600">
            Loading Managements data...
          </span>
        </div>
      )}

      {!isLoading && !error && orgData && orgData?.length > 0 && (
        <div className="overflow-hidden">
          <OrganizationChart
            data={orgData?.[0] as OrgChartNode}
            onEditBtnClick={(node) => onEditBtnClick(node)}
            onAddBtnClick={(node) => onAddBtnClick(node)}
          />
        </div>
      )}
    </main>
  );
};

export default BranchManagementsStructure;
