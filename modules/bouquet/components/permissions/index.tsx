"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Accordion } from "@/components/ui/accordion";
import { apiClient } from "@/config/axios-config";
import { toast } from 'sonner';
import PermissionCategory from "./PermissionCategory";
import SubmitButton from "./SubmitButton";
import { 
  PermissionItem, 
  PermissionWithStatus, 
  PermissionsData, 
  PackagePermissionsRoot,
  CategoryPermissionsPayload,
} from "./types";

// Props interface
interface PermissionsBouquetProps {
  packageId: string;
}

// Helper function to map permission type to switch type
const permissionTypeMap = new Map<string, string>([
  ['view', 'view'],
  ['update', 'edit'],
  ['delete', 'delete'],
  ['create', 'create'],
  ['export', 'export'],
  ['activate', 'activate'],
  ['list', 'list']
]);

const getSwitchTypeFromPermissionType = (permissionType: string): string | null => {

};

function PermissionsBouquet({ packageId }: PermissionsBouquetProps) {
  const [permissions, setPermissions] = useState<PermissionsData | null>(null);
  const [packagePermissions, setPackagePermissions] = useState<PackagePermissionsRoot | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({});
  const [numberValues, setNumberValues] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Helper function to create default permissions structure
  const createDefaultPermissions = useCallback((lookupPayload: CategoryPermissionsPayload): PermissionsData => {
    const defaultPermissions: PermissionsData = {};
    Object.entries(lookupPayload).forEach(([categoryKey, lookupCategoryData]) => {
      if (lookupCategoryData && typeof lookupCategoryData === 'object') {
        defaultPermissions[categoryKey] = {};
        Object.entries(lookupCategoryData).forEach(([subKey, lookupItems]) => {
          if (Array.isArray(lookupItems)) {
            defaultPermissions[categoryKey][subKey] = lookupItems.map((item: any) => ({
              id: item.id,
              key: item.key,
              type: item.type,
              name: item.name,
              is_active: false
            }));
          }
        });
      }
    });
    return defaultPermissions;
  }, []);

  // Helper function to merge lookup data with package permissions
  const mergePermissionsData = useCallback((lookupPayload: CategoryPermissionsPayload, packageData: any) => {
    const newActiveStates: Record<string, boolean> = {};
    const newNumberValues: Record<string, number> = {};
    const newSwitchStates: Record<string, boolean> = {};
    const mergedPermissions: PermissionsData = {};
    
    Object.entries(lookupPayload).forEach(([categoryKey, lookupCategoryData]) => {
      if (lookupCategoryData && typeof lookupCategoryData === 'object') {
        mergedPermissions[categoryKey] = {};
        
        Object.entries(lookupCategoryData).forEach(([subKey, lookupItems]) => {
          if (Array.isArray(lookupItems)) {
            const packageCategoryData = packageData.payload?.permissions?.[categoryKey];
            const packageSubItems = packageCategoryData?.[subKey] || [];
            
            const mergedItems: PermissionWithStatus[] = lookupItems.map((lookupItem: any) => {
              const packageItem = Array.isArray(packageSubItems) 
                ? packageSubItems.find((pItem: any) => pItem.id === lookupItem.id)
                : null;
              
              const switchType = getSwitchTypeFromPermissionType(lookupItem.type);
              if (switchType) {
                const stateKey = `${categoryKey}.${subKey}.${switchType}`;
                const switchId = `${subKey}-${switchType}`;
                newActiveStates[stateKey] = packageItem?.is_active === true;
                newSwitchStates[switchId] = packageItem?.is_active === true;
              }
              
              if (packageItem?.limit !== undefined && packageItem?.limit !== null) {
                newNumberValues[subKey] = packageItem.limit;
              }
              
              return {
                id: lookupItem.id,
                key: lookupItem.key,
                type: lookupItem.type,
                name: lookupItem.name,
                is_active: packageItem?.is_active || false,
                limit: packageItem?.limit
              };
            });
            
            mergedPermissions[categoryKey][subKey] = mergedItems;
          }
        });
      }
    });
    
    return { mergedPermissions, newActiveStates, newNumberValues, newSwitchStates };
  }, []);

  // Function to fetch lookup permissions
  const fetchLookupPermissions = useCallback(async () => {
    const response = await apiClient.get(`/role_and_permissions/permissions/lookup?package_id=${packageId}`);
    return response.data?.payload;
  }, [packageId]);

  // Function to fetch package permissions
  const fetchPackagePermissions = useCallback(async () => {
    if (!packageId) return null;
    const response = await apiClient.get(`/packages/${packageId}/permissions`);
    return response.data;
  }, [packageId]);

  // Main data fetching function
  const fetchData = useCallback(async () => {
    try {
      const lookupPayload = await fetchLookupPermissions();
      
      if (!lookupPayload || typeof lookupPayload !== 'object') {
        setPermissions(null);
        return;
      }

      if (packageId) {
        try {
          const packageData = await fetchPackagePermissions();
          
          if (packageData) {
            setPackagePermissions(packageData as PackagePermissionsRoot);
            
            const { mergedPermissions, newActiveStates, newNumberValues, newSwitchStates } = 
              mergePermissionsData(lookupPayload, packageData);
            
            setPermissions(mergedPermissions);
            setActiveStates(newActiveStates);
            setNumberValues(newNumberValues);
            setSwitchStates(newSwitchStates);
          } else {
            console.warn('No package data found');
            setPermissions(createDefaultPermissions(lookupPayload));
          }
        } catch (packageError) {
          console.error('Package API Error:', packageError);
          setPackagePermissions(null);
          setPermissions(createDefaultPermissions(lookupPayload));
        }
      } else {
        console.warn('No package ID found, cannot fetch package permissions');
        setPermissions(createDefaultPermissions(lookupPayload));
      }
    } catch (error) {
      console.error('Lookup API Error:', error);
      setPermissions(null);
      setPackagePermissions(null);
    } finally {
      setLoading(false);
    }
  }, [packageId, fetchLookupPermissions, fetchPackagePermissions, mergePermissionsData, createDefaultPermissions]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);


  const handlePermissionChange = useCallback((permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const newSelected = new Set(prev);
      checked ? newSelected.add(permissionId) : newSelected.delete(permissionId);
      return newSelected;
    });
  }, []);

  // Helper function to find category key for a given subKey
  const findCategoryKeyForSubKey = useCallback((subKey: string): string => {
    if (!permissions) return '';
    
    for (const [catKey, catData] of Object.entries(permissions)) {
      if (catData && typeof catData === 'object' && catData[subKey]) {
        return catKey;
      }
    }
    return '';
  }, [permissions]);

  // Helper function to generate active state key
  const generateActiveStateKey = useCallback((switchId: string): string | null => {
    const [subKey, switchType] = switchId.split('-');
    const categoryKey = findCategoryKeyForSubKey(subKey);
    
    return categoryKey ? `${categoryKey}.${subKey}.${switchType}` : null;
  }, [findCategoryKeyForSubKey]);

  const handleSwitchChange = useCallback((switchId: string, checked: boolean, permissionId?: string) => {

    setSwitchStates(prev => ({
      ...prev,
      [switchId]: checked
    }));
    
    const activeStateKey = generateActiveStateKey(switchId);
    
    if (activeStateKey) {
      setActiveStates(prev => ({
        ...prev,
        [activeStateKey]: checked
      }));
    }
  }, [generateActiveStateKey]);
  
  const handleNumberChange = useCallback((permissionId: string, value: number) => {
    // Validate the input value
    if (typeof value !== 'number' || isNaN(value)) {
      console.warn(`Invalid number value for permission ${permissionId}:`, value);
      return;
    }
    
    // Ensure the value is not negative
    const validatedValue = Math.max(0, Math.floor(value));
    
    // Log warning if value was adjusted
    if (validatedValue !== value) {
      console.warn(`Value for permission ${permissionId} was adjusted from ${value} to ${validatedValue}`);
    }
    
    setNumberValues(prev => ({
      ...prev,
      [permissionId]: validatedValue
    }));
  }, []);


  // Function to get all currently active permission IDs
  const getAllActivePermissionIds = (): string[] => {
    const activeIds: string[] = [];
    
    if (permissions && packagePermissions?.payload.permissions) {
      Object.entries(permissions).forEach(([categoryKey, categoryData]) => {
        if (categoryData && typeof categoryData === 'object') {
          Object.entries(categoryData).forEach(([subKey, subItems]) => {
            if (Array.isArray(subItems)) {
              subItems.forEach((item: PermissionItem) => {
                const switchType = getSwitchTypeFromPermissionType(item.type);
                if (switchType) {
                  const stateKey = `${categoryKey}.${subKey}.${switchType}`;
                  if (activeStates[stateKey]) {
                    activeIds.push(item.id);
                  }
                }
              });
            }
          });
        }
      });
    }
    
    return activeIds;
  };

  // Function to submit all active permission IDs to API
   const submit = async () => {
    setSubmitting(true);
    try {
      // Get all currently active permission IDs
      const activePermissionIds = getAllActivePermissionIds();
      
      if (activePermissionIds.length === 0) {
        toast.warning('No permissions selected');
        setSubmitting(false);
        return;
      }

      // Create limits array with permission_id and number
      const limits: Array<{ permission_id: string; number: number }> = [];
      
      // Map subKey to create permission IDs and their number values
      if (permissions) {
        Object.entries(permissions).forEach(([categoryKey, categoryData]) => {
          if (categoryData && typeof categoryData === 'object') {
            Object.entries(categoryData).forEach(([subKey, subItems]) => {
              if (Array.isArray(subItems)) {
                // Find the create permission for this subKey
                const createItem = subItems.find(item => item.type === 'create');
                
                // If create permission exists and has a number value, add to limits
                if (createItem && numberValues[subKey] !== undefined && numberValues[subKey] > 0) {
                  limits.push({
                    permission_id: createItem.id,
                    number: numberValues[subKey]
                  });
                }
              }
            });
          }
        });
      }
      
      const response = await apiClient.post(`/packages/${packageId}/assign-permissions`, {
        permissions: activePermissionIds,
        limits: limits
      });

      if (response.status === 200 || response.status === 201) {        
        try {
          toast.success('Permissions assigned successfully!');
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
          if (!categoryData || Object.keys(categoryData).length === 0) {
            return null;
          }

          return (
            <PermissionCategory
              key={categoryKey}
              categoryKey={categoryKey}
              categoryData={categoryData}
              selectedPermissions={selectedPermissions}
              switchStates={switchStates}
              activeStates={activeStates}
              numberValues={numberValues}
              onPermissionChange={handlePermissionChange}
              onSwitchChange={handleSwitchChange}
              onNumberChange={handleNumberChange}
            />
          );
        })}
      </Accordion>
      
      <SubmitButton
        onSubmit={submit}
        submitting={submitting}
      /> 
    </div>
  );
}

export default PermissionsBouquet;
