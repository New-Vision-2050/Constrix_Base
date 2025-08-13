import React, { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/modules/table/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PermissionWithStatus } from "./types";

// Define permission type configuration structure
type PermissionTypeConfig = {
  type: string;
  displayType: string;
  hasPermission?: boolean; // This will be set dynamically in the component
};

// Base permission types configuration - moved outside component
const BASE_PERMISSION_TYPES: PermissionTypeConfig[] = [
  { type: 'view', displayType: 'view', hasPermission: false },
  { type: 'update', displayType: 'edit', hasPermission: false },
  { type: 'delete', displayType: 'delete', hasPermission: false },
  { type: 'create', displayType: 'create', hasPermission: false },
  { type: 'export', displayType: 'export', hasPermission: false },
  { type: 'activate', displayType: 'activate', hasPermission: false },
  { type: 'list', displayType: 'list', hasPermission: false }
];

interface PermissionRowProps {
  mainKey: string;
  subKey: string;
  categoryKey: string;
  subItems: PermissionWithStatus[];
  selectedPermissions: Set<string>;
  switchStates: Record<string, boolean>;
  activeStates: Record<string, boolean>;
  numberValues: Record<string, number>;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onSwitchChange: (switchId: string, checked: boolean, permissionId?: string) => void;
  onNumberChange: (subKey: string, value: number) => void;
}

const PermissionRow: React.FC<PermissionRowProps> = ({
  mainKey,
  subKey,
  categoryKey,
  subItems,
  selectedPermissions,
  switchStates,
  activeStates,
  numberValues,
  onPermissionChange,
  onSwitchChange,
  onNumberChange
}) => {
  // Memoize the available types set to avoid recreating on every render
  const availableTypes = useMemo(() => new Set(subItems.map(item => item.type)), [subItems]);
  
  // Memoize the permission types with dynamic hasPermission values
  const permissionTypes = useMemo(() => {
    return BASE_PERMISSION_TYPES.map(type => ({
      ...type,
      hasPermission: availableTypes.has(type.type)
    }));
  }, [availableTypes]);


  // Helper function to render permission switch
  const renderPermissionSwitch = (permissionConfig: typeof permissionTypes[0]) => {
    const { type, displayType, hasPermission } = permissionConfig;
    const switchId = `${subKey}-${categoryKey}-${type}`;
    const stateKey = `${mainKey}.${subKey}.${categoryKey}.${type}`;
    
    return (
      <td key={displayType} className={`px-4 py-4 text-center ${switchStates[switchId] ? 'bg-sidebar' : ''}`}>
        <div className="flex items-center justify-center">
          <Switch
            id={switchId}
            checked={switchStates[switchId] || false}
            disabled={!hasPermission}
            onCheckedChange={(checked) => {
              const item = subItems.find(item => item.type === type);
              onSwitchChange(switchId, checked, item?.id);
            }}
          />
        </div>
      </td>
    );
  };

  // Get the first item (since we're passing single item as array)
  const item = subItems[0];
  const permissionId = item.id;
  const permissionName = item.name;
  
  // Find the create permission item to get its limit value
  const createItem = subItems.find(item => item.type === 'create');
  const createLimitValue = createItem?.limit || 0;
  
  // Handle checkbox change to activate/deactivate all switches in this row
  const handleCheckboxChange = (checked: boolean) => {
    // First update the permission selection
    onPermissionChange(permissionId, checked);
    
    // Then activate/deactivate all available switches in this row
    permissionTypes.forEach(permissionConfig => {
      if (permissionConfig.hasPermission) {
        const switchId = `${subKey}-${categoryKey}-${permissionConfig.type}`;
        const relatedItem = subItems.find(item => item.type === permissionConfig.type);
        onSwitchChange(switchId, checked, relatedItem?.id);
      }
    });
  };
  
  return (
    <tr key={permissionId}>
      <td className="px-4 py-4 text-center">
        <Checkbox
          id={permissionId}
          checked={selectedPermissions.has(permissionId)}
          onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
        />
      </td>
      <td className="px-4 py-4 text-right text-sm text-white font-medium">
        {categoryKey}
      </td>
      {permissionTypes.map(renderPermissionSwitch)}
      <td className="px-4 py-4 text-center text-sm text-white font-medium">
        <Input
          className="w-16 p-1 text-center bg-sidebar border border-gray-100 rounded  disabled:bg-gray-700 disabled:text-gray-600"
          value={numberValues[`${subKey}-${categoryKey}`] !== undefined ? (numberValues[`${subKey}-${categoryKey}`] > 0 ? numberValues[`${subKey}-${categoryKey}`] : '') : (createLimitValue > 0 ? createLimitValue : '')}
          onChange={(e) => onNumberChange(`${subKey}-${categoryKey}`, parseInt(e.target.value) || 0)}
          min="0"
          disabled={!switchStates[`${subKey}-${categoryKey}-create`]}
        />
      </td>
    </tr>
  );
};

export default PermissionRow;
