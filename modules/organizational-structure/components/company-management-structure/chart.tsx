"use client";
import { Loader2 } from "lucide-react";
import { useCallback, useMemo } from "react";
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
  const { isUserCompanyOwner, companyOwnerId, handleStoreBranch } =
    useManagementsStructureCxt();
  const config = useMemo(() => {
    return GetOrgStructureManagementFormConfig({
      branchId,
      isUserCompanyOwner,
      companyOwnerId,
    });
  }, [isUserCompanyOwner, companyOwnerId,branchId]);
  const { openSheet, isOpen, closeSheet } = useSheetForm({ config });
  const { data: orgData, isLoading, error } = useManagementsTreeData(branchId);
  const onAddBtnClick = useCallback((node: OrgChartNode) => {
    handleStoreBranch(node);
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

      {!isLoading && !error && orgData && (
        <div className="overflow-hidden">
          <OrganizationChart
            data={orgData[0] as OrgChartNode}
            onAddBtnClick={(node) => onAddBtnClick(node)}
          />
        </div>
      )}
    </main>
  );
};

export default BranchManagementsStructure;
