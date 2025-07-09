import { useContext } from 'react';
import { Actions, AppAbility, Subjects } from '@/lib/ability';
import { AbilityContext } from '@/contexts/AbilityContext';

type PermissionMap = { [key: string]: boolean };

// Function to create the can checker with a given ability instance
function createCanChecker(ability: AppAbility) {
  return (action: Actions | Actions[], subject: Subjects | Subjects[]): boolean | PermissionMap => {
    // If both action and subject are arrays, return a map of permissions
    if (Array.isArray(action) && Array.isArray(subject)) {
      const permissionMap: PermissionMap = {};
      action.forEach(a => {
        subject.forEach(s => {
          permissionMap[`${a}.${s}`] = ability.can(a, s);
        });
      });
      return permissionMap;
    }

    // If only action is an array, check all actions for the subject
    if (Array.isArray(action)) {
      if (Array.isArray(subject)) {
        throw new Error('Cannot check multiple subjects with multiple actions in this format. Use arrays for both.');
      }
      const permissionMap: PermissionMap = {};
      action.forEach(a => {
        permissionMap[a] = ability.can(a, subject);
      });
      return permissionMap;
    }

    // If only subject is an array, check all subjects for the action
    if (Array.isArray(subject)) {
      const permissionMap: PermissionMap = {};
      subject.forEach(s => {
        permissionMap[s] = ability.can(action, s);
      });
      return permissionMap;
    }

    // Single action and subject check
    return ability.can(action, subject);
  };
}

// Hook that uses the context
export function useCan() {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error('useCan must be used within AbilityProvider');
  }
  return { can: createCanChecker(ability) };
}

// Direct can function that uses the context
export function can(action: Actions | Actions[], subject: Subjects | Subjects[]): boolean | PermissionMap {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error('can must be used within AbilityProvider');
  }
  return createCanChecker(ability)(action, subject);
}

/**
 * Usage:
 * // Using the hook:
 * const { can } = useCan();
 * const canRead = can('read', 'companies.company');
 * 
 * // Using direct can function:
 * import { can } from './useCan';
 * const canRead = can('read', 'companies.company');
 * 
 * // Both support checking multiple actions/subjects:
 * const permissions = can(['create', 'update'], ['companies.company', 'users.user']);
 * console.log(permissions); // { 'create.companies.company': true, 'update.companies.company': false, ... }
 */