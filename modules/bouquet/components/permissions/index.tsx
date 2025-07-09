"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/modules/table/components/ui/switch";
import { apiClient } from "@/config/axios-config";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

// Types
interface PermissionItem {
  id: string;
  key: string;
  name: string;
  type: string;
}

type CategoryData = Record<string, PermissionItem[]>;
type Payload = Record<string, CategoryData>;

// Props interface
interface PermissionsBouquetProps {
  packageId: string;
}

function PermissionsBouquet({ packageId }: PermissionsBouquetProps) {
  const [permissions, setPermissions] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const params = useParams();
  const id = params?.id 
  // Fetch permissions from API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await apiClient.get('/role_and_permissions/permissions/lookup');
        const payload = response.data?.payload;
        
        if (payload && typeof payload === 'object') {
          setPermissions(payload as Payload);
        } else {
          console.warn('Invalid payload structure received from API');
          setPermissions(null);
        }
      } catch (error) {
        console.error('API Error:', error);
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Handle permission selection
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newSelected = new Set(prev);
      checked ? newSelected.add(permissionId) : newSelected.delete(permissionId);
      return newSelected;
    });
  };

  // Handle switch state changes
  const handleSwitchChange = (switchId: string, checked: boolean) => {
    setSwitchStates(prev => ({
      ...prev,
      [switchId]: checked
    }));
    
    // Print all active permission keys whenever a switch changes
    const updatedStates = {
      ...switchStates,
      [switchId]: checked
    };
    
    const activeKeys = getActivePermissionKeys(updatedStates);
  };

  // Function to get all active permission keys only
  const getActivePermissionKeys = (states: Record<string, boolean> = switchStates) => {
    const activeKeys: string[] = [];
    
    if (!permissions) return activeKeys;
    
    // Map switch types to permission types
    const switchTypeMap: Record<string, string> = {
      'view': 'view',
      'edit': 'update',
      'delete': 'delete', 
      'create': 'create',
      'export': 'export',
      'activate': 'activate',
      'list': 'list'
    };
    
    Object.entries(permissions).forEach(([categoryKey, categoryData]) => {
      Object.entries(categoryData).forEach(([subKey, subItems]) => {
        // Check each switch type for this subKey
        Object.entries(switchTypeMap).forEach(([switchType, permissionType]) => {
          const switchId = `${subKey}-${switchType}`;
          if (states[switchId]) {
            // Find the permission item with matching type
            const matchingItem = subItems.find(item => item.type === permissionType);
            if (matchingItem) {
              activeKeys.push(matchingItem.id);
            }
          }
        });
      });
    });
    
    return activeKeys;
  };

  // Function to submit active permissions to API
  const submit = async () => {
    try {
      const activeKeys = getActivePermissionKeys();
      
      if (activeKeys.length === 0) {
        toast.warning('No permissions selected');
        return;
      }

      const response = await apiClient.post(`/packages/${id}/assign-permissions`, {
        permissions: activeKeys
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Permissions assigned successfully!');
        console.log('Permissions sent:', activeKeys);
      } else {
        throw new Error('Failed to assign permissions');
      }
    } catch (error) {
      console.error('Error assigning permissions:', error);
      toast.error('Failed to assign permissions. Please try again.');
    }
  };


  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  // Error state
  if (!permissions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Error loading permissions</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* One Accordion per payload key */}
      <Accordion type="multiple" className="w-full">
        {Object.entries(permissions).map(([categoryKey, categoryData]) => {
          // Get all subcategory keys for this category
          const allSubKeys = Object.keys(categoryData);
          const allSelected = allSubKeys.every(subKey => selectedPermissions.has(subKey));
          
          // Handler for select all checkbox
          const handleSelectAll = (checked: boolean) => {
            setSelectedPermissions(prev => {
              const newSelected = new Set(prev);
              if (checked) {
                // Add all subcategories
                allSubKeys.forEach(subKey => newSelected.add(subKey));
              } else {
                // Remove all subcategories
                allSubKeys.forEach(subKey => newSelected.delete(subKey));
              }
              return newSelected;
            });
          };

          return (
            <AccordionItem key={categoryKey} value={categoryKey}>
              <AccordionTrigger className="text-right text-lg font-bold hover:no-underline">
                {categoryKey.replace('-', ' ').toUpperCase()}
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="mt-4 p-4 rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-transparent">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-center text-sm font-medium">
                            <Checkbox 
                              checked={allSelected}
                              onCheckedChange={handleSelectAll}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" 
                            /> 
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium">الصلاحية</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">عرض</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">تعديل</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">حذف</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">إنشاء</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">تصدير</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">تنشيط</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">قائمة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(categoryData).map(([subKey, subItems]) => {
                          console.log('subItems:', subItems);
                          
                          // Check which permission types are available
                          const availableTypes = new Set(subItems.map(item => item.type));
                          const hasView = availableTypes.has('view');
                          const hasUpdate = availableTypes.has('update');
                          const hasDelete = availableTypes.has('delete');
                          const hasCreate = availableTypes.has('create');
                          const hasExport = availableTypes.has('export');
                          const hasActivate = availableTypes.has('activate');
                          const hasList = availableTypes.has('list');
                          
                          return (
                            <React.Fragment key={subKey}>
                              <tr key={subKey}>
                                  <td className="px-4 py-4 text-center">
                                    <Checkbox
                                      id={subKey}
                                      checked={selectedPermissions.has(subKey)}
                                      onCheckedChange={(checked) => handlePermissionChange(subKey, checked as boolean)}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                    />
                                  </td>
                                  <td className="px-4 py-4 text-right text-sm text-white font-medium">
                                    {subKey}
                                  </td>
                                  <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-view`] ? 'bg-sidebar' : ''}`}>
                                    <div className="flex items-center justify-center">
                                      <Switch
                                        id={`${subKey}-view`}
                                        checked={switchStates[`${subKey}-view`] || false}
                                        disabled={!hasView}
                                        onCheckedChange={(checked) => handleSwitchChange(`${subKey}-view`, checked)}
                                      />
                                    </div>
                                  </td>
                                  <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-edit`] ? 'bg-sidebar' : ''}`}>
                                    <div className="flex items-center justify-center">
                                      <Switch
                                        id={`${subKey}-edit`}
                                        checked={switchStates[`${subKey}-edit`] || false}
                                        disabled={!hasUpdate}
                                        onCheckedChange={(checked) => handleSwitchChange(`${subKey}-edit`, checked)}
                                      />
                                    </div>
                                  </td>
                                  <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-delete`] ? 'bg-sidebar' : ''}`}>
                                    <div className="flex items-center justify-center">
                                      <Switch
                                        id={`${subKey}-delete`}
                                        checked={switchStates[`${subKey}-delete`] || false}
                                        disabled={!hasDelete}
                                        onCheckedChange={(checked) => handleSwitchChange(`${subKey}-delete`, checked)}
                                      />
                                    </div>
                                  </td>
                                  <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-create`] ? 'bg-sidebar' : ''}`}>
                                    <div className="flex items-center justify-center">
                                      <Switch
                                        id={`${subKey}-create`}
                                        checked={switchStates[`${subKey}-create`] || false}
                                        disabled={!hasCreate}
                                        onCheckedChange={(checked) => handleSwitchChange(`${subKey}-create`, checked)}
                                      />
                                    </div>
                                  </td>
                                  <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-export`] ? 'bg-sidebar' : ''}`}>
                                    <div className="flex items-center justify-center">
                                      <Switch
                                        id={`${subKey}-export`}
                                        checked={switchStates[`${subKey}-export`] || false}
                                        disabled={!hasExport}
                                        onCheckedChange={(checked) => handleSwitchChange(`${subKey}-export`, checked)}
                                      />
                                    </div>
                                  </td>
                                  <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-activate`] ? 'bg-sidebar' : ''}`}>
                                    <div className="flex items-center justify-center">
                                      <Switch
                                        id={`${subKey}-activate`}
                                        checked={switchStates[`${subKey}-activate`] || false}
                                        disabled={!hasActivate}
                                        onCheckedChange={(checked) => handleSwitchChange(`${subKey}-activate`, checked)}
                                      />
                                    </div>
                                  </td>
                                  <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-list`] ? 'bg-sidebar' : ''}`}>
                                    <div className="flex items-center justify-center">
                                      <Switch
                                        id={`${subKey}-list`}
                                        checked={switchStates[`${subKey}-list`] || false}
                                        disabled={!hasList}
                                        onCheckedChange={(checked) => handleSwitchChange(`${subKey}-list`, checked)}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      
      {/* Print Button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={submit}
        >
          Submit
        </Button>
      </div> 
    </div>
  );
}

export default PermissionsBouquet;
