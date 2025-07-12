// Practical example for using permissions in the Companies page
// Place this in your companies page component

import { useCan } from '@/hooks/useCan';
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from '@/modules/roles-and-permissions/permissions';

export function CompaniesPagePermissions() {
  const { can } = useCan();

  // Check permissions for companies
  const canListCompanies = can(PERMISSION_ACTIONS.LIST, PERMISSION_SUBJECTS.COMPANY);
  const canCreateCompany = can(PERMISSION_ACTIONS.CREATE, PERMISSION_SUBJECTS.COMPANY);
  const canUpdateCompany = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.COMPANY);
  const canDeleteCompany = can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.COMPANY);
  const canExportCompanies = can(PERMISSION_ACTIONS.EXPORT, PERMISSION_SUBJECTS.COMPANY);
  const canViewCompany = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.COMPANY);

  return {
    canListCompanies,
    canCreateCompany,
    canUpdateCompany,
    canDeleteCompany,
    canExportCompanies,
    canViewCompany,
  };
}

// Usage in your CompaniesPage component:
/*
const CompaniesPage = () => {
  const {
    canListCompanies,
    canCreateCompany,
    canUpdateCompany,
    canDeleteCompany,
    canExportCompanies,
    canViewCompany,
  } = CompaniesPagePermissions();

  // Don't render anything if user can't list companies
  if (!canListCompanies) {
    return <div>You don't have permission to view companies.</div>;
  }

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />

      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            {canCreateCompany && (
              <SheetFormBuilder
                config={GetCompaniesFormConfig(t)}
                trigger={<Button>{t("createCompany")}</Button>}
                onSuccess={handleFormSuccess}
              />
            )}
            {canExportCompanies && (
              <Button onClick={handleExport}>
                {t("exportCompanies")}
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
};
*/

// For other pages, similar patterns:

// User Profile permissions
export function UserProfilePermissions() {
  const { can } = useCan();
  
  return {
    canUpdateUserData: can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.USER_PROFILE_DATA),
    canViewUserContact: can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.USER_PROFILE_CONTACT),
    canUpdateUserContact: can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.USER_PROFILE_CONTACT),
    canViewUserIdentity: can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.USER_PROFILE_IDENTITY),
    canUpdateUserIdentity: can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.USER_PROFILE_IDENTITY),
  };
}

// Roles permissions
export function RolesPermissions() {
  const { can } = useCan();
  
  return {
    canListRoles: can(PERMISSION_ACTIONS.LIST, PERMISSION_SUBJECTS.ROLE),
    canCreateRole: can(PERMISSION_ACTIONS.CREATE, PERMISSION_SUBJECTS.ROLE),
    canUpdateRole: can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.ROLE),
    canDeleteRole: can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.ROLE),
    canViewRole: can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.ROLE),
  };
}

// Users permissions
export function UsersPermissions() {
  const { can } = useCan();
  
  return {
    canListUsers: can(PERMISSION_ACTIONS.LIST, PERMISSION_SUBJECTS.USER),
    canCreateUser: can(PERMISSION_ACTIONS.CREATE, PERMISSION_SUBJECTS.USER),
    canUpdateUser: can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.USER),
    canDeleteUser: can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.USER),
    canViewUser: can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.USER),
    canExportUsers: can(PERMISSION_ACTIONS.EXPORT, PERMISSION_SUBJECTS.USER),
  };
}
