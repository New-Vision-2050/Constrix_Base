// Permission subjects extracted from the permission strings
// Subject is the text before the last dot in permission strings
// Example: organization.management.create -> subject: organization.management, action: create

export const SUBJECTS = {
  // Users module subjects
  USERS_USER: 'users.user',
  USERS_CLIENT: 'users.client',
  USERS_BROKER: 'users.broker',
  USERS_EMPLOYEE: 'users.employee',

  // User Profile module subjects
  USER_PROFILE_DATA: 'user-profile.data',
  USER_PROFILE_CONTACT: 'user-profile.contact',
  USER_PROFILE_IDENTITY: 'user-profile.identity',
  USER_PROFILE_PERSONAL_INFORMATION: 'user-profile.personal-information',
  USER_PROFILE_CONTACT_INFORMATION: 'user-profile.contact-information',
  USER_PROFILE_PASSPORT_INFORMATION: 'user-profile.passport-information',
  USER_PROFILE_BANK_INFORMATION: 'user-profile.bank-information',
  USER_PROFILE_ADDRESS_INFORMATION: 'user-profile.address-information',
  USER_PROFILE_MARITAL_STATUS: 'user-profile.marital-status',
  USER_PROFILE_SOCIAL_MEDIA_ACCOUNT: 'user-profile.social-media-account',
  USER_PROFILE_BORDER_NUMBER_INFORMATION: 'user-profile.border-number-information',
  USER_PROFILE_RESIDENCE_INFORMATION: 'user-profile.residence-information',
  USER_PROFILE_ABOUT_ME_INFORMATION: 'user-profile.about-me-information',
  USER_PROFILE_CV: 'user-profile.cv',
  USER_PROFILE_JOB_OFFER: 'user-profile.job-offer',
  USER_PROFILE_CONTRACT_WORK: 'user-profile.contract-work',
  USER_PROFILE_EMPLOYMENT_INFORMATION: 'user-profile.employment-information',
  USER_PROFILE_SALARY_INFORMATION: 'user-profile.salary-information',
  USER_PROFILE_QUALIFICATION: 'user-profile.qualification',
  USER_PROFILE_EXPERIENCE: 'user-profile.experience',
  USER_PROFILE_COURSES: 'user-profile.courses',
  USER_PROFILE_CERTIFICATES: 'user-profile.certificates',
  USER_PROFILE_WORK_LICENSE: 'user-profile.work-license',

  // Companies module subjects
  COMPANIES_COMPANY: 'companies.company',

  // Settings module subjects
  SETTINGS_ROLE: 'settings.role',
  SETTINGS_PERMISSION: 'settings.permission',
  SETTINGS_IDENTIFIER: 'settings.identifier',
  SETTINGS_LOGIN_WAY: 'settings.login-way',
  SETTINGS_COMPANY_PROFILE: 'settings.company-profile',
  SETTINGS_DRIVER: 'settings.driver',

  // Organization module subjects
  ORGANIZATION_BRANCH: 'organization.branch',
  ORGANIZATION_MANAGEMENT: 'organization.management',
  ORGANIZATION_USERS: 'organization.users',
  ORGANIZATION_JOB_TITLE: 'organization.job-title',
  ORGANIZATION_JOB_TYPE: 'organization.job-type',

  // Company Profile module subjects
  COMPANY_PROFILE_OFFICIAL_DATA: 'company-profile.official-data',
  COMPANY_PROFILE_LEGAL_DATA: 'company-profile.legal-data',
  COMPANY_PROFILE_ADDRESS: 'company-profile.address',
  COMPANY_PROFILE_BRANCH: 'company-profile.branch',
  COMPANY_PROFILE_OFFICIAL_DOCUMENT: 'company-profile.official-document',

  // Country module subjects
  COUNTRY_COUNTRY: 'country.country',
  COUNTRY_STATE: 'country.state',
  COUNTRY_CITY: 'country.city',
} as const;

// Extract all subject values as a union type
export type SubjectValues = typeof SUBJECTS[keyof typeof SUBJECTS];

// Create an array of all subject values for runtime use
export const SUBJECT_VALUES = Object.values(SUBJECTS);
