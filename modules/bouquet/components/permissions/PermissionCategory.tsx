import React, { useMemo } from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import PermissionTableHeader from "./PermissionTableHeader";
import PermissionRow from "./PermissionRow";
import { CategoryPermissions } from "./types";


const formatCategoryKey = (key: string): string => {
  const withSpaces = key.replace(/[-_]+/g, ' ');
    return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


interface PermissionCategoryProps {
  categoryKey: string;
  categoryData: CategoryPermissions;
  selectedPermissions: Set<string>;
  switchStates: Record<string, boolean>;
  activeStates: Record<string, boolean>;
  numberValues: Record<string, number>;
  onPermissionChange: (subKey: string, checked: boolean) => void;
  onSwitchChange: (switchId: string, checked: boolean, permissionId?: string) => void;
  onNumberChange: (permissionId: string, value: number) => void;
}

const PermissionCategory: React.FC<PermissionCategoryProps> = ({
  categoryKey,
  categoryData,
  selectedPermissions,
  switchStates,
  activeStates,
  numberValues,
  onPermissionChange,
  onSwitchChange,
  onNumberChange
}) => {
  // Memoize the subKeys to avoid recalculating on every render
  const allSubKeys = useMemo(() => Object.keys(categoryData), [categoryData]);
  
  // Check if all permissions in this category are selected
  const allSelected = useMemo(() => {
    return allSubKeys.length > 0 && allSubKeys.every(subKey => selectedPermissions.has(subKey));
  }, [allSubKeys, selectedPermissions]);

  const handleSelectAll = useMemo(() => {
    return (checked: boolean) => {
      allSubKeys.forEach(subKey => {
        if (checked && !selectedPermissions.has(subKey)) {
          onPermissionChange(subKey, true);
        } else if (!checked && selectedPermissions.has(subKey)) {
          onPermissionChange(subKey, false);
        }
      });
    };
  }, [allSubKeys, selectedPermissions, onPermissionChange]);


  return (
    <AccordionItem key={categoryKey} value={categoryKey}>
      <AccordionTrigger className="text-right text-lg font-bold hover:no-underline">
        {formatCategoryKey(categoryKey)}
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <div className="mt-4 p-4 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-transparent">
              <PermissionTableHeader 
                allSelected={allSelected}
                onSelectAll={handleSelectAll}
              />
              <tbody>
                {Object.entries(categoryData).map(([subKey, subItems]) => (
                  <React.Fragment key={subKey}>
                    <PermissionRow
                      subKey={subKey}
                      categoryKey={categoryKey}
                      subItems={subItems}
                      selectedPermissions={selectedPermissions}
                      switchStates={switchStates}
                      activeStates={activeStates}
                      numberValues={numberValues}
                      onPermissionChange={onPermissionChange}
                      onSwitchChange={onSwitchChange}
                      onNumberChange={onNumberChange}
                    />
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PermissionCategory;
