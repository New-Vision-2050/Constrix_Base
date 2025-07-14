import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/modules/table/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PermissionWithStatus } from "./types";

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
  const availableTypes = new Set(subItems.map(item => item.type));
  
  // Permission type configurations
  const permissionTypes = [
    { type: 'view', displayType: 'view', hasPermission: availableTypes.has('view') },
    { type: 'update', displayType: 'edit', hasPermission: availableTypes.has('update') },
    { type: 'delete', displayType: 'delete', hasPermission: availableTypes.has('delete') },
    { type: 'create', displayType: 'create', hasPermission: availableTypes.has('create') },
    { type: 'export', displayType: 'export', hasPermission: availableTypes.has('export') },
    { type: 'activate', displayType: 'activate', hasPermission: availableTypes.has('activate') },
    { type: 'list', displayType: 'list', hasPermission: availableTypes.has('list') }
  ];

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
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
        />
      </td>
      <td className="px-4 py-4 text-right text-sm text-white font-medium">
        {subKey}
      </td>
      {permissionTypes.map(renderPermissionSwitch)}
      <td className="px-4 py-4 text-center text-sm text-white font-medium">
        <Input
          className="w-16 p-1 text-center bg-gray-700 border border-gray-600 rounded text-white"
          value={numberValues[subKey] || 0}
          onChange={(e) => onNumberChange(subKey, parseInt(e.target.value) || 0)}
          min="0"
          disabled={!activeStates[`${categoryKey}.${subKey}.create`]}
        />
      </td>
    </tr>
  );
};

export default PermissionRow;
