"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/modules/table/components/ui/switch";
import { apiClient } from "@/config/axios-config";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

// Types
interface PermissionItem {
  id: string;
  key: string;
  name: string;
  type: string;
}

type CategoryData = Record<string, PermissionItem[]>;
type Payload = Record<string, CategoryData>;

// Package permissions interfaces (dynamic structure)
export interface Root {
  payload: {
    id: string;
    name: string;
    permissions: Permissions;
  };
}

export interface Permissions {
  [key: string]: CategoryPermissions;
}

export interface CategoryPermissions {
  [subcategory: string]: PermissionWithStatus[];
}


export interface PermissionWithStatus {
  id: string;
  key: string;
  type: string;
  name: string;
  is_active: boolean;
}

// Props interface
interface PermissionsBouquetProps {
  packageId: string;
}

// Helper function to map permission type to switch type
const getSwitchTypeFromPermissionType = (permissionType: string): string | null => {
  const typeMap: Record<string, string> = {
    'view': 'view',
    'update': 'edit',
    'delete': 'delete',
    'create': 'create',
    'export': 'export',
    'activate': 'activate',
    'list': 'list'
  };
  return typeMap[permissionType] || null;
};

function PermissionsBouquet({ packageId }: PermissionsBouquetProps) {
  const [permissions, setPermissions] = useState<Payload | null>(null);
  const [packagePermissions, setPackagePermissions] = useState<Root | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  const [changedPermissionIds, setChangedPermissionIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lookupResponse = await apiClient.get('/role_and_permissions/permissions/lookup');
        const payload = lookupResponse.data?.payload;
        
        if (payload && typeof payload === 'object') {
          setPermissions(payload as Payload);
        } else {
          setPermissions(null);
        }

        if (packageId) {
          try {
            const packageResponse = await apiClient.get(`/packages/${packageId}/permissions`);
            const packageData = packageResponse.data;
            
            if (packageData) {
              setPackagePermissions(packageData as Root);
              
              const newActiveStates: Record<string, boolean> = {};
              
              if (packageData.payload.permissions) {
                Object.entries(packageData.payload.permissions).forEach(([categoryKey, categoryData]) => {
                  console.log(`Category: ${categoryKey}`);
                  if (categoryData && typeof categoryData === 'object') {
                    Object.entries(categoryData).forEach(([subKey, subItems]) => {
                      if (Array.isArray(subItems)) {
                        subItems.forEach((item: any, index: number) => {
                          
                          
                          const switchType = getSwitchTypeFromPermissionType(item.type);
                          if (switchType) {
                            const stateKey = `${categoryKey}.${subKey}.${switchType}`;
                            newActiveStates[stateKey] = item.is_active === true;
                          }
                        });
                      }
                    });
                  }
                });
              }
              
              setActiveStates(newActiveStates);
              
              const initialSwitchStates: Record<string, boolean> = {};
                            
              if (packageData.permissions && typeof packageData.permissions === 'object') {
                Object.entries(packageData.permissions).forEach(([categoryKey, categoryData]) => {
                if (categoryData && typeof categoryData === 'object') {
                  Object.entries(categoryData).forEach(([subKey, subItems]) => {
                    if (Array.isArray(subItems)) {
                      subItems.forEach((item: PermissionWithStatus) => {
                        const switchType = getSwitchTypeFromPermissionType(item.type);
                        if (switchType) {
                          const switchId = `${subKey}-${switchType}`;
                          initialSwitchStates[switchId] = item.is_active;
                        }
                      });
                    }
                  });
                }
                });
              }
              
              setSwitchStates(initialSwitchStates);
            }
          } catch (packageError) {
            console.error('Package API Error:', packageError);
            setPackagePermissions(null);
          }
        } else {
          console.warn('No package ID found, cannot fetch package permissions');
        }
      } catch (error) {
        console.error('Lookup API Error:', error);
        setPermissions(null);
        setPackagePermissions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [packageId, refreshTrigger]);


  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newSelected = new Set(prev);
      checked ? newSelected.add(permissionId) : newSelected.delete(permissionId);
      return newSelected;
    });
  };

  const handleSwitchChange = (switchId: string, checked: boolean, permissionId?: string) => {
    setSwitchStates(prev => ({
      ...prev,
      [switchId]: checked
    }));
    
    const [subKey, switchType] = switchId.split('-');
    
    let categoryKey = '';
    
    if (permissions) {
      Object.entries(permissions).forEach(([catKey, catData]) => {
        if (catData && typeof catData === 'object' && catData[subKey]) {
          categoryKey = catKey;
        }
      });
    }
    
    if (categoryKey) {
      const activeStateKey = `${categoryKey}.${subKey}.${switchType}`;
      setActiveStates(prev => ({
        ...prev,
        [activeStateKey]: checked
      }));
    }
    
    // Toggle permissionId in changedPermissionIds array
    if (permissionId) {
      setChangedPermissionIds(prev => {
        const newIds = [...prev];
        const existingIndex = newIds.indexOf(permissionId);
        
        if (existingIndex === -1) {
          // ID not in array, add it
          newIds.push(permissionId);
        } else {
          // ID exists in array, remove it
          newIds.splice(existingIndex, 1);
        }
        
        return newIds;
      });
    }
  };

  // Function to submit changed permission IDs to API
   const submit = async () => {
    setSubmitting(true);
    try {
      // Send only the changed permission IDs
      if (changedPermissionIds.length === 0) {
        toast.warning('No permissions have been changed');
        setSubmitting(false);
        return;
      }

      const response = await apiClient.post(`/packages/${packageId}/assign-permissions`, {
        permissions: changedPermissionIds
      });

      if (response.status === 200 || response.status === 201) {        
        try {
          toast.success('Permissions assigned successfully!');
          // Reset changed permissions after successful submission
          setChangedPermissionIds([]);
          // Trigger useEffect to refresh data
          setRefreshTrigger(prev => prev + 1);
          
        } catch (e) {
          console.error('Toast method 1 failed:', e);
        }
      } else {
        throw new Error('Failed to assign permissions');
      }
    } catch (error) {
      console.error('Error assigning permissions:', error);
      toast.error('Failed to assign permissions. Please try again.');
    } finally {
      setSubmitting(false);
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
          const allSubKeys = Object.keys(categoryData);
          const allSelected = allSubKeys.every(subKey => selectedPermissions.has(subKey));
          
          const handleSelectAll = (checked: boolean) => {
            setSelectedPermissions(prev => {
              const newSelected = new Set(prev);
              if (checked) {
                allSubKeys.forEach(subKey => newSelected.add(subKey));
              } else {
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
                                      checked={activeStates[`${categoryKey}.${subKey}.view`] || false}
                                      disabled={!hasView}
                                      onCheckedChange={(checked) => {
                                        const viewItem = subItems.find(item => item.type === 'view');
                                        handleSwitchChange(`${subKey}-view`, checked, viewItem?.id);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-edit`] ? 'bg-sidebar' : ''}`}>
                                  <div className="flex items-center justify-center">
                                    <Switch
                                      id={`${subKey}-edit`}
                                      checked={activeStates[`${categoryKey}.${subKey}.edit`] || false}
                                      disabled={!hasUpdate}
                                      onCheckedChange={(checked) => {
                                        const editItem = subItems.find(item => item.type === 'update');
                                        handleSwitchChange(`${subKey}-edit`, checked, editItem?.id);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-delete`] ? 'bg-sidebar' : ''}`}>
                                  <div className="flex items-center justify-center">
                                    <Switch
                                      id={`${subKey}-delete`}
                                      checked={activeStates[`${categoryKey}.${subKey}.delete`] || false}
                                      disabled={!hasDelete}
                                      onCheckedChange={(checked) => {
                                        const deleteItem = subItems.find(item => item.type === 'delete');
                                        handleSwitchChange(`${subKey}-delete`, checked, deleteItem?.id);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-create`] ? 'bg-sidebar' : ''}`}>
                                  <div className="flex items-center justify-center">
                                    <Switch
                                      id={`${subKey}-create`}
                                      checked={activeStates[`${categoryKey}.${subKey}.create`] || false}
                                      disabled={!hasCreate}
                                      onCheckedChange={(checked) => {
                                        const createItem = subItems.find(item => item.type === 'create');
                                        handleSwitchChange(`${subKey}-create`, checked, createItem?.id);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-export`] ? 'bg-sidebar' : ''}`}>
                                  <div className="flex items-center justify-center">
                                    <Switch
                                      id={`${subKey}-export`}
                                      checked={activeStates[`${categoryKey}.${subKey}.export`] || false}
                                      disabled={!hasExport}
                                      onCheckedChange={(checked) => {
                                        const exportItem = subItems.find(item => item.type === 'export');
                                        handleSwitchChange(`${subKey}-export`, checked, exportItem?.id);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-activate`] ? 'bg-sidebar' : ''}`}>
                                  <div className="flex items-center justify-center">
                                    <Switch
                                      id={`${subKey}-activate`}
                                      checked={activeStates[`${categoryKey}.${subKey}.activate`] || false}
                                      disabled={!hasActivate}
                                      onCheckedChange={(checked) => {
                                        const activateItem = subItems.find(item => item.type === 'activate');
                                        handleSwitchChange(`${subKey}-activate`, checked, activateItem?.id);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className={`px-4 py-4 text-center ${switchStates[`${subKey}-list`] ? 'bg-sidebar' : ''}`}>
                                  <div className="flex items-center justify-center">
                                    <Switch
                                      id={`${subKey}-list`}
                                      checked={activeStates[`${categoryKey}.${subKey}.list`] || false}
                                      disabled={!hasList}
                                      onCheckedChange={(checked) => {
                                        const listItem = subItems.find(item => item.type === 'list');
                                        handleSwitchChange(`${subKey}-list`, checked, listItem?.id);
                                      }}
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
          disabled={submitting}
        >
          {submitting ? 'Loading' : 'Submit'}
        </Button>
      </div> 
    </div>
  );
}

export default PermissionsBouquet;
