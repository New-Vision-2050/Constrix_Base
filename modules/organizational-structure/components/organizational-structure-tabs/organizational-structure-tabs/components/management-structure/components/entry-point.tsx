"use client";

import ReactFlowDiagram from "./ReactFlowDiagram";
import VerticalBtnsList from "@/components/shared/VerticalList";
import ManagementStructureSearchBar from "./ManagementStructureSearchBar";
import { useOrgStructureCxt } from "@/modules/organizational-structure/context/OrgStructureCxt";
import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useManagementsStructureCxt } from "../context";

export default function CompanyStructureEntryPoint() {
  const { branchiesList } = useOrgStructureCxt();
  const { handleChangeActiveBranch } = useManagementsStructureCxt();
  const [items, setItems] = useState<UserProfileNestedTab[]>([]);

  // ** handle side effects
  useEffect(() => {
    if (branchiesList) {
      const _items = branchiesList?.map((branch) => ({
        id: branch.id,
        title: branch.name,
        icon: <MapPin />,
        content: <>{branch.name}</>,
        ignoreValidation: true,
        onClick() {
          handleChangeActiveBranch(branch.id);
        },
      }));
      if (_items.length) handleChangeActiveBranch(_items[0]?.id);
      setItems(_items);
    }
  }, [branchiesList]);

  return (
    <div className="flex flex-col gap-7">
      <ManagementStructureSearchBar />
      <div className="flex gap-8">
        <VerticalBtnsList items={items} />
        <div className="p-4 flex-grow gap-8">
          <ReactFlowDiagram />
        </div>
      </div>
    </div>
  );
}
