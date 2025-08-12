import { createPermissions as create } from "./default-permissions";

export const PERMISSIONS = {
  user: create("USER"),
  profile: {
    education: create("PROFILE_EDUCATION"),
    certificates: create("PROFILE_CERTIFICATES"),
    qualification: create("PROFILE_QUALIFICATION"),
    addressInfo: create("PROFILE_ADDRESS_INFO"),
    maritalStatus: create("PROFILE_MARITAL_STATUS"),
    courses: create("PROFILE_COURSES"),
    employmentInfo: create("PROFILE_EMPLOYMENT_INFO"),
    familyInfo: create("PROFILE_FAMILY_INFO"),
    cv: create("PROFILE_CV"),
    borderNumber: create("PROFILE_BORDER_NUMBER"),
    privileges: create("PROFILE_PRIVILEGES"),
    contactInfo: create("PROFILE_CONTACT_INFO"),
    bankInfo: create("PROFILE_BANK_INFO"),
    personalInfo: create("PROFILE_PERSONAL_INFO"),
    salaryInfo: create("PROFILE_SALARY_INFO"),
    aboutMe: create("PROFILE_ABOUT_ME"),
    residenceInfo: create("PROFILE_RESIDENCE_INFO"),
    experience: create("PROFILE_EXPERIENCE"),
    workLicense: create("PROFILE_WORK_LICENSE"),
    socialMedia: create("PROFILE_SOCIAL_MEDIA"),
    contractWork: create("PROFILE_CONTRACT_WORK"),
    jobOffer: create("PROFILE_JOB_OFFER"),
    passportInfo: create("PROFILE_PASSPORT_INFO"),
  },
  company: create("COMPANY"),
  companyAccessProgram: create("COMPANY_ACCESS_PROGRAM"),
  package: create("PACKAGE"),
  companyProfile: {
    legalData: create("COMPANY_PROFILE_LEGAL_DATA"),
    officialDocument: create("COMPANY_PROFILE_OFFICIAL_DOCUMENT"),
    branch: create("COMPANY_PROFILE_BRANCH"),
    address: create("COMPANY_PROFILE_ADDRESS"),
    officialData: create("COMPANY_PROFILE_OFFICIAL_DATA"),
  },

  organization: {
    branch: create("ORGANIZATION_BRANCH"),
    department: create("ORGANIZATION_DEPARTMENT"),
    jobType: create("ORGANIZATION_JOB_TYPE"),
    users: create("ORGANIZATION_USERS"),
    management: create("ORGANIZATION_MANAGEMENT"),
    jobTitle: create("ORGANIZATION_JOB_TITLE"),
  },

  userProfile: {
    contact: create("USER_PROFILE_CONTACT"),
    identity: create("USER_PROFILE_IDENTITY"),
    data: create("USER_PROFILE_DATA"),
  },

  permission: create("PERMISSION"),
  city: create("CITY"),
  loginWay: create("LOGIN_WAY"),
  state: create("STATE"),
  role: create("ROLE"),
  country: create("COUNTRY"),
  driver: create("DRIVER"),
  identifier: create("IDENTIFIER"),
  subEntity: create("SUB_ENTITY"),

  // Attendance
  attendance: {
    settings: create("EMPLOYEE_ATTENDANCE_CONSTRAINTS"),
    attendance_departure: create("EMPLOYEE_ATTENDANCE"),
  },
};
