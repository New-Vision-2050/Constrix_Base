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
    supportData: create("COMPANY_PROFILE_SUPPORT_DATA"),
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

  activityLogs: create("LOG"),

  // Attendance
  attendance: {
    settings: create("EMPLOYEE_ATTENDANCE_CONSTRAINTS"),
    attendance_departure: {
      ...create("EMPLOYEE_ATTENDANCE"),
      map: "EMPLOYEE_ATTENDANCE_MAP", // إضافة permission مخصص للخريطة
    },
  },
  // vacations
  vacations: {
    settings: {
      leaveType: create("LEAVE_TYPE"),
      leavePolicy: create("LEAVE_POLICY"),
      publicHoliday: create("PUBLIC_HOLIDAY"),
    },
  },
  // CRM
  crm: {
    settings: create("CLIENT_SETTING"),
    broker: create("BROKER"),
    clients: create("CLIENT"),
  },
  // docs library
  library: {
    folder: create("FOLDER"),
    file: create("FILE"),
  },
  // Content Management System
  CMS: {
    categories: create("CATEGORY_WEBSITE_CMS", [
      "LIST",
      "CREATE",
      "UPDATE",
      "DELETE",
    ]), //LIST,CREATE,UPDATE,DELETE
    projects: create("WEBSITE_PROJECT", ["LIST", "CREATE", "UPDATE", "DELETE"]), //LIST,CREATE,UPDATE,DELETE
    projectsTypes: create("WEBSITE_PROJECT_SETTING", [
      "LIST",
      "CREATE",
      "UPDATE",
      "DELETE",
    ]), //LIST,CREATE,UPDATE,DELETE
    icons: create("WEBSITE_ICON", ["LIST", "CREATE", "UPDATE", "DELETE"]), //LIST,CREATE,UPDATE,DELETE
    mainSettings: create("WEBSITE_HOME_PAGE_SETTING", ["VIEW", "UPDATE"]), // just view,update
    aboutSetting: create("WEBSITE_ABOUT_US", ["VIEW", "UPDATE"]), // just view,update - renames to aboutSetting
    termsConditions: create("WEBSITE_TERM_AND_CONDITION", ["VIEW", "UPDATE"]), // just view,update
    news: create("WEBSITE_NEWS", ["LIST", "CREATE", "UPDATE", "DELETE"]), //LIST,CREATE,UPDATE,DELETE
    founder: create("FOUNDER", ["LIST", "CREATE", "UPDATE", "DELETE"]), //LIST,CREATE,UPDATE,DELETE
    services: create("WEBSITE_SERVICE", ["LIST", "UPDATE", "CREATE", "DELETE"]), // just view,update,create,delete
    ourServices: create("WEBSITE_OUR_SERVICE", ["VIEW", "UPDATE"]), // just view,update,create,delete
    // WEBSITE_SERVICE - LIST,CREATE,UPDATE,ACTIVATE,DELETE
    communicationSettings: {
      contactData: create("WEBSITE_CONTACT_INFO", ["VIEW", "UPDATE"]), // just view,update
      addresses: create("WEBSITE_ADDRESS", [
        "LIST",
        "CREATE",
        "UPDATE",
        "DELETE",
      ]), //LIST,CREATE,UPDATE,DELETE
      socialLinks: create("SOCIAL_MEDIA_LINK", [
        "LIST",
        "CREATE",
        "UPDATE",
        "DELETE",
      ]), //LIST,CREATE,UPDATE,DELETE
    },
    themeSetting: create("WEBSITE_THEME"), // just view,update
    communicationContactMessages: create("WEBSITE_CONTACT_MESSAGE", [
      "LIST",
      "UPDATE",
      "DELETE",
    ]), //LIST,VIEW,REPLY=UPDATE,DELETE
    //WEBSITE_THEME_SETTING - LIST,SHOW,ACTIVATE
  },
  // ecommerce
  ecommerce: {
    //Banner
    banner: create("ECOMMERCE_BANNER", ["LIST", 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Coupon
    coupon: create('ECOMMERCE_COUPON', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Dashboard
    dashboard: create('ECOMMERCE_DASHBOARD', ['VIEW']),//'ORDERS_CHART','WAREHOUSES_TABLE'
    //Deal Day
    dealDay: create('ECOMMERCE_DEAL_DAY', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Brand
    brand: create('ECOMMERCE_ECO_BRAND', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Category
    category: create('ECOMMERCE_CATEGORY', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Product
    product: create('ECOMMERCE_PRODUCT', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Feature Deal
    featureDeal: create('ECOMMERCE_FEATURE_DEAL', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Flash Deal
    flashDeal: create('ECOMMERCE_FLASH_DEAL', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Order
    order: create('ECOMMERCE_ORDER', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Social Media
    socialMedia: create('ECOMMERCE_SOCIAL_MEDIA', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    // Warehouse
    warehouse: create('ECOMMERCE_WAREHOUSE', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'ACTIVATE', 'DELETE', 'EXPORT']),
    //Page
    page: create('ECOMMERCE_PAGE', ['LIST', 'VIEW', 'CREATE', 'UPDATE', 'DELETE']),
    //Payment Method
    paymentMethod: create('ECOMMERCE_PAYMENT_METHOD', ['LIST', 'ACTIVATE']),
  }
};
