// Practical example for using permissions in the Companies page
// Place this in your companies page component

import { useCan } from '@/hooks/useCan';
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from '@/constants/permissions';

export function CompaniesPagePermissions() {
  const { can } = useCan();

  // Check permissions for companies
  const canListCompanies = can('LIST', 'COMPANY');
  const canCreateCompany = can('CREATE', 'COMPANY');
  const canUpdateCompany = can('UPDATE', 'COMPANY');
  const canDeleteCompany = can('DELETE', 'COMPANY');
  const canExportCompanies = can('EXPORT', 'COMPANY');
  const canViewCompany = can('VIEW', 'COMPANY');

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
    canUpdateUserData: can('UPDATE', 'USER_PROFILE_DATA'),
    canViewUserContact: can('VIEW', 'USER_PROFILE_CONTACT'),
    canUpdateUserContact: can('UPDATE', 'USER_PROFILE_CONTACT'),
    canViewUserIdentity: can('VIEW', 'USER_PROFILE_IDENTITY'),
    canUpdateUserIdentity: can('UPDATE', 'USER_PROFILE_IDENTITY'),
  };
}

// Roles permissions
export function RolesPermissions() {
  const { can } = useCan();
  
  return {
    canListRoles: can('LIST', 'ROLE'),
    canCreateRole: can('CREATE', 'ROLE'),
    canUpdateRole: can('UPDATE', 'ROLE'),
    canDeleteRole: can('DELETE', 'ROLE'),
    canViewRole: can('VIEW', 'ROLE'),
  };
}

// Users permissions
export function UsersPermissions() {
  const { can } = useCan();
  
  return {
    canListUsers: can('LIST', 'USER'),
    canCreateUser: can('CREATE', 'USER'),
    canUpdateUser: can('UPDATE', 'USER'),
    canDeleteUser: can('DELETE', 'USER'),
    canViewUser: can('VIEW', 'USER'),
    canExportUsers: can('EXPORT', 'USER'),
  };
}
