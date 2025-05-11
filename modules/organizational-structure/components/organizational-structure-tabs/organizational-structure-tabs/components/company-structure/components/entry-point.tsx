"use client";
import VerticalBtnsList from "@/components/shared/VerticalList";
import TabContentHeader from "@/modules/organizational-structure/components/TabContentHeader";
import { useOrgStructureCxt } from "@/modules/organizational-structure/context/OrgStructureCxt";
import { useEffect, useState } from "react";
import { UserProfileNestedTab } from "@/modules/user-profile/types/user-profile-nested-tabs-content";
import { MapPin } from "lucide-react";

export default function CompanyStructureEntryPoint() {
  const { branchiesList } = useOrgStructureCxt();
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
        onClick() {},
      }));
      setItems(_items);
    }
  }, [branchiesList]);
  return (
    <div className="flex flex-col gap-7">
      <TabContentHeader title="بنية الشركة" />
      <div className="flex gap-8">
        <VerticalBtnsList items={items} />
        <div className="p-4 flex-grow gap-8">{/* <ReactFlowDiagram /> */}</div>
      </div>
    </div>
  );
}
