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
  subKey: string;
  categoryKey: string;
  subItems: PermissionWithStatus[];
  selectedPermissions: Set<string>;
  switchStates: Record<string, boolean>;
  activeStates: Record<string, boolean>;
  numberValues: Record<string, number>;
  onPermissionChange: (subKey: string, checked: boolean) => void;
  onSwitchChange: (switchId: string, checked: boolean, permissionId?: string) => void;
  onNumberChange: (permissionId: string, value: number) => void;
}

const PermissionRow: React.FC<PermissionRowProps> = ({
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
    const switchId = `${subKey}-${displayType}`;
    const stateKey = `${categoryKey}.${subKey}.${displayType}`;
    
    return (
      <td key={displayType} className={`px-4 py-4 text-center ${switchStates[switchId] ? 'bg-sidebar' : ''}`}>
        <div className="flex items-center justify-center">
          <Switch
            id={switchId}
            checked={activeStates[stateKey] || false}
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

  return (
    <tr key={subKey}>
      <td className="px-4 py-4 text-center">
        <Checkbox
          id={subKey}
          checked={selectedPermissions.has(subKey)}
          onCheckedChange={(checked) => onPermissionChange(subKey, checked as boolean)}
        />
      </td>
      <td className="px-4 py-4 text-right text-sm text-white font-medium">
        {subKey}
      </td>
      {permissionTypes.map(renderPermissionSwitch)}
      <td className="px-4 py-4 text-center text-sm text-white font-medium">
        <Input
          className="w-16 p-1 text-center bg-sidebar border border-sidebar-border rounded"
          value={numberValues[subKey] > 0 ? numberValues[subKey] : ''}
          onChange={(e) => onNumberChange(subKey, parseInt(e.target.value) || 0)}
          min="0"
          disabled={!activeStates[`${categoryKey}.${subKey}.create`]}
        />
      </td>
    </tr>
  );
};

export default PermissionRow;
