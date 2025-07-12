// Example usage of the new permission system in a React component

import { useCan } from '@/hooks/useCan';
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from '@/constants/permissions';
import { defineAbilityFor, Actions, Subjects } from '@/lib/ability';

export function CompanyPageExample() {
  const { can } = useCan();

  // Check specific permissions
  const canListCompanies = can(PERMISSION_ACTIONS.LIST, PERMISSION_SUBJECTS.COMPANY);
  const canCreateCompany = can(PERMISSION_ACTIONS.CREATE, PERMISSION_SUBJECTS.COMPANY);
  const canUpdateCompany = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.COMPANY);
  const canDeleteCompany = can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.COMPANY);
  const canExportCompanies = can(PERMISSION_ACTIONS.EXPORT, PERMISSION_SUBJECTS.COMPANY);

  // Check multiple permissions at once
  const companyPermissions = can(
    [PERMISSION_ACTIONS.LIST, PERMISSION_ACTIONS.CREATE, PERMISSION_ACTIONS.UPDATE],
    PERMISSION_SUBJECTS.COMPANY
  );

  return (
    <div>
      {/* Show table only if user can list companies */}
      {canListCompanies && (
        <div>Company Table Component</div>
      )}
      
      {/* Show create button only if user can create companies */}
      {canCreateCompany && (
        <button>Create Company</button>
      )}
      
      {/* Show export button only if user can export companies */}
      {canExportCompanies && (
        <button>Export Companies</button>
      )}
      
      {/* Using multiple permissions check */}
      {typeof companyPermissions === 'object' && companyPermissions[PERMISSION_ACTIONS.UPDATE] && (
        <button>Edit Company</button>
      )}
    </div>
  );
}

// Alternative usage with direct permission strings
export function UserProfileExample() {
  const { can } = useCan();

  // Direct string usage (matches the permission structure from backend)
  const canUpdateUserData = can('UPDATE', 'USER_PROFILE_DATA');
  const canViewUserContact = can('VIEW', 'USER_PROFILE_CONTACT');
  const canUpdateQualification = can('UPDATE', 'PROFILE_QUALIFICATION');

  return (
    <div>
      {canUpdateUserData && <div>Edit User Data Form</div>}
      {canViewUserContact && <div>Contact Info Section</div>}
      {canUpdateQualification && <div>Qualification Edit Form</div>}
    </div>
  );
}

// Usage in API route middleware
export function withPermissionCheck(requiredAction: Actions, requiredSubject: Subjects) {
  return function(handler: any) {
    return async function(req: any, res: any) {
      // Get user permissions from request/session
      const userPermissions = req.user?.permissions || [];
      
      // Create ability instance
      const ability = defineAbilityFor(userPermissions);
      
      // Check permission
      if (!ability.can(requiredAction, requiredSubject)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      return handler(req, res);
    };
  };
}

// Example API route usage
// export default withPermissionCheck('CREATE', 'COMPANY')(async function handler(req, res) {
//   // Create company logic here
// });
