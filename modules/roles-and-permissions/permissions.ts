// Permission subjects and actions extracted from the new permission structure
// These constants help with type safety and consistency across the application

export const PERMISSION_ACTIONS = {
  LIST: 'LIST',
  CREATE: 'CREATE', 
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXPORT: 'EXPORT',
  VIEW: 'VIEW',
  ACTIVATE: 'ACTIVATE'
} as const;

export const PERMISSION_SUBJECTS = {
  // User Profile subjects
  USER_PROFILE_DATA: 'USER_PROFILE_DATA',
  USER_PROFILE_CONTACT: 'USER_PROFILE_CONTACT',
  USER_PROFILE_IDENTITY: 'USER_PROFILE_IDENTITY',
  
  // Company subjects
  COMPANY: 'COMPANY',
  COMPANY_PROFILE: 'COMPANY_PROFILE',
  COMPANY_PROFILE_LEGAL_DATA: 'COMPANY_PROFILE_LEGAL_DATA',
  COMPANY_PROFILE_OFFICIAL_DATA: 'COMPANY_PROFILE_OFFICIAL_DATA',
  COMPANY_PROFILE_ADDRESS: 'COMPANY_PROFILE_ADDRESS',
  COMPANY_PROFILE_BRANCH: 'COMPANY_PROFILE_BRANCH',
  COMPANY_PROFILE_OFFICIAL_DOCUMENT: 'COMPANY_PROFILE_OFFICIAL_DOCUMENT',
  
  // Profile subjects
  PROFILE_CV: 'PROFILE_CV',
  PROFILE_QUALIFICATION: 'PROFILE_QUALIFICATION',
  PROFILE_ABOUT_ME: 'PROFILE_ABOUT_ME',
  PROFILE_EXPERIENCE: 'PROFILE_EXPERIENCE',
  PROFILE_COURSES: 'PROFILE_COURSES',
  PROFILE_CERTIFICATES: 'PROFILE_CERTIFICATES',
  PROFILE_MARITAL_STATUS: 'PROFILE_MARITAL_STATUS',
  PROFILE_CONTACT_INFO: 'PROFILE_CONTACT_INFO',
  PROFILE_PERSONAL_INFO: 'PROFILE_PERSONAL_INFO',
  PROFILE_BANK_INFO: 'PROFILE_BANK_INFO',
  PROFILE_RESIDENCE_INFO: 'PROFILE_RESIDENCE_INFO',
  PROFILE_BORDER_NUMBER: 'PROFILE_BORDER_NUMBER',
  PROFILE_ADDRESS_INFO: 'PROFILE_ADDRESS_INFO',
  PROFILE_PASSPORT_INFO: 'PROFILE_PASSPORT_INFO',
  PROFILE_SOCIAL_MEDIA: 'PROFILE_SOCIAL_MEDIA',
  PROFILE_WORK_LICENSE: 'PROFILE_WORK_LICENSE',
  PROFILE_CONTRACT_WORK: 'PROFILE_CONTRACT_WORK',
  PROFILE_SALARY_INFO: 'PROFILE_SALARY_INFO',
  PROFILE_JOB_OFFER: 'PROFILE_JOB_OFFER',
  PROFILE_EMPLOYMENT_INFO: 'PROFILE_EMPLOYMENT_INFO',

  // Organization subjects
  ORGANIZATION_BRANCH: 'ORGANIZATION_BRANCH',
  ORGANIZATION_MANAGEMENT: 'ORGANIZATION_MANAGEMENT',
  ORGANIZATION_USERS: 'ORGANIZATION_USERS',
  ORGANIZATION_JOB_TITLE: 'ORGANIZATION_JOB_TITLE',
  ORGANIZATION_JOB_TYPE: 'ORGANIZATION_JOB_TYPE',
  
  // User types
  USER: 'USER',
  CLIENT: 'CLIENT',
  BROKER: 'BROKER',
  EMPLOYEE: 'EMPLOYEE',
  
  // Geographic subjects
  COUNTRY: 'COUNTRY',
  STATE: 'STATE',
  CITY: 'CITY',
  
  // System subjects
  ROLE: 'ROLE',
  PERMISSION: 'PERMISSION',
  DRIVER: 'DRIVER',
  LOGIN_WAY: 'LOGIN_WAY'
} as const;

export type PermissionAction = typeof PERMISSION_ACTIONS[keyof typeof PERMISSION_ACTIONS];
export type PermissionSubject = typeof PERMISSION_SUBJECTS[keyof typeof PERMISSION_SUBJECTS];

// Helper function to build permission keys
export function buildPermissionKey(subject: string, action: string): string {
  return `${subject.toUpperCase()}_${action.toUpperCase()}`;
}

// Helper function to parse permission key
export function parsePermissionKey(key: string): { action: string; subject: string } {
  const parts = key.split('_');
  const action = parts[parts.length - 1];
  const subjectParts = parts.slice(0, -1);
  const subject = subjectParts.join('_');
  
  return { action, subject };
}

// Common permission combinations
export const COMMON_PERMISSIONS = {
  // Company permissions
  COMPANY_FULL_ACCESS: ['LIST', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT'].map(action => 
    buildPermissionKey('COMPANY', action)
  ),
  
  // User permissions  
  USER_FULL_ACCESS: ['LIST', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT'].map(action =>
    buildPermissionKey('USER', action)
  ),
  
  // Profile permissions
  PROFILE_FULL_ACCESS: [
    'PROFILE_CV_UPDATE',
    'PROFILE_QUALIFICATION_CREATE',
    'PROFILE_QUALIFICATION_UPDATE', 
    'PROFILE_QUALIFICATION_DELETE',
    'PROFILE_EXPERIENCE_CREATE',
    'PROFILE_EXPERIENCE_UPDATE',
    'PROFILE_EXPERIENCE_DELETE'
  ]
} as const;
