import React, { useMemo } from "react";
import PermissionTableHeader from "./PermissionTableHeader";
import PermissionRow from "./PermissionRow";
import { CategoryPermissions, PermissionWithStatus } from "./types";

const formatCategoryKey = (key: string): string => {
  const withSpaces = key.replace(/[-_]+/g, ' ');
    return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface PermissionCategoryProps {
  mainKey: string;
  subKey: string;
  categoryKey: string;
  categoryData: CategoryPermissions; // Now it's always an array
  selectedPermissions: Set<string>;
  switchStates: Record<string, boolean>;
  activeStates: Record<string, boolean>;
  numberValues: Record<string, number>;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onSwitchChange: (switchId: string, checked: boolean, permissionId?: string) => void;
  onNumberChange: (subKey: string, value: number) => void;
}

const PermissionCategory: React.FC<PermissionCategoryProps> = ({
  mainKey,
  subKey,
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
  // Memoize the permission IDs to avoid recalculating on every render
  const allPermissionIds = useMemo(() => categoryData.map(item => item.id), [categoryData]);
  
  // Check if all permissions in this category are selected
  const allSelected = useMemo(() => {
    return allPermissionIds.length > 0 && allPermissionIds.every(id => selectedPermissions.has(id));
  }, [allPermissionIds, selectedPermissions]);

  const handleSelectAll = useMemo(() => {
    return (checked: boolean) => {
      allPermissionIds.forEach(id => {
        if (checked && !selectedPermissions.has(id)) {
          onPermissionChange(id, true);
        } else if (!checked && selectedPermissions.has(id)) {
          onPermissionChange(id, false);
        }
      });
    };
  }, [allPermissionIds, selectedPermissions, onPermissionChange]);

  return (
    <div className="mb-6">      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <PermissionTableHeader 
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {categoryData.map((item) => (
              <PermissionRow
                key={item.id}
                mainKey={mainKey}
                subKey={subKey}
                categoryKey={categoryKey}
                subItems={[item]} // Pass single item as array for compatibility
                selectedPermissions={selectedPermissions}
                switchStates={switchStates}
                activeStates={activeStates}
                numberValues={numberValues}
                onPermissionChange={onPermissionChange}
                onSwitchChange={onSwitchChange}
                onNumberChange={onNumberChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionCategory;
