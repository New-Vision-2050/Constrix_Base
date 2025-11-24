import { MessagesGroup } from "./types";
import { breadcrumbsMessages } from "./groups/breadcrumbs";
import { commonMessages } from "./groups/common";
import { locationMessages } from "./groups/location";
import { mainMessages } from "./groups/main";
import { loginMessages } from "./groups/login";
import { forgotPasswordMessages } from "./groups/forgot-password";
import { resetPasswordMessages } from "./groups/reset-password";
import { changeEmailMessages } from "./groups/change-email";
import { securityQuestionsMessages } from "./groups/security-questions";
import { errorsMessages } from "./groups/errors";
import { validationMessages } from "./groups/validation";
import { tableMessages } from "./groups/table";
import { companiesMessages } from "./groups/companies";
import { sidebarMessages } from "./groups/sidebar";
import { docsLibraryMessages } from "./groups/docs-library";
import { userSettingDialogMessages } from "./groups/user-setting-dialog";
import { headerMessages } from "./groups/header";
import { attendanceDepartureMessages } from "./groups/attendance-departure";
import { formBuilderMessages } from "./groups/form-builder";
import { userProfileMessages } from "./groups/user-profile";
import { activitiesLogsMessages } from "./groups/activities-logs";
import { companyProfileMessages } from "./groups/company-profile";
import { companyStructureMessages } from "./groups/company-structure";
import { personalDataFormMessages } from "./groups/personal-data-form";
import { clientsModuleMessages } from "./groups/clients-module";
import { brokersModuleMessages } from "./groups/brokers-module";
import { crmsettingsModuleMessages } from "./groups/crmsettings-module";
import { attendanceDepartureModuleMessages } from "./groups/attendance-departure-module";
import { hrSettingsMessages } from "./groups/hr-settings";
import { hrsettingsAttendanceDepartureModuleMessages } from "./groups/hrsettings-attendance-departure-module";
import { hrsettingsVacationsMessages } from "./groups/hrsettings-vacations";
import { roleTypesMessages } from "./groups/role-types";
import { createRoleMessages } from "./groups/create-role";
import { programsMessages } from "./groups/programs";
import { bouquetsMessages } from "./groups/bouquets";
import { brandMessages } from "./groups/brand";
import { warehouseMessages } from "./groups/warehouse";
import { categoryMessages } from "./groups/category";
import { labelsMessages } from "./groups/labels";
import { productMessages } from "./groups/product";
import { couponMessages } from "./groups/coupon";
import { dealOfDayMessages } from "./groups/deal-of-day";
import { featuredDealMessages } from "./groups/featured-deal";
import { offerMessages } from "./groups/offer";
import { termsMessages } from "./groups/terms";
import { pagesMessages } from "./groups/pages";
import { pagesSettingsMessages } from "./groups/pages-settings";
import { socialMediaMessages } from "./groups/social-media";
import { requestsMessages } from "./groups/requests";
import { paymentMethodsMessages } from "./groups/payment-methods";
import { contentManagementSystemMessages } from "./groups/content-management-system";
import { editSubEntityMessages } from "./groups/edit-sub-entity";

// Main messages structure combining all groups
export const messagesStructure = new MessagesGroup({
  breadcrumbs: breadcrumbsMessages,
  common: commonMessages,
  location: locationMessages,
  Main: mainMessages,
  Login: loginMessages,
  ForgotPassword: forgotPasswordMessages,
  ResetPassword: resetPasswordMessages,
  ChangeEmail: changeEmailMessages,
  SecurityQuestions: securityQuestionsMessages,
  Errors: errorsMessages,
  Validation: validationMessages,
  Table: tableMessages,
  Companies: companiesMessages,
  Sidebar: sidebarMessages,
  "docs-library": docsLibraryMessages,
  EditSubEntityMessages: editSubEntityMessages,
  UserSettingDialog: userSettingDialogMessages,
  Header: headerMessages,
  attendanceDeparture: attendanceDepartureMessages,
  FormBuilder: formBuilderMessages,
  UserProfile: userProfileMessages,
  activitiesLogs: activitiesLogsMessages,
  companyProfile: companyProfileMessages,
  CompanyStructure: companyStructureMessages,
  PersonalDataForm: personalDataFormMessages,
  ClientsModule: clientsModuleMessages,
  BrokersModule: brokersModuleMessages,
  CRMSettingsModule: crmsettingsModuleMessages,
  AttendanceDepartureModule: attendanceDepartureModuleMessages,
  "hr-settings": hrSettingsMessages,
  HRSettingsAttendanceDepartureModule: hrsettingsAttendanceDepartureModuleMessages,
  HRSettingsVacations: hrsettingsVacationsMessages,
  RoleTypes: roleTypesMessages,
  CreateRole: createRoleMessages,
  Programs: programsMessages,
  Bouquets: bouquetsMessages,
  brand: brandMessages,
  warehouse: warehouseMessages,
  category: categoryMessages,
  labels: labelsMessages,
  product: productMessages,
  coupon: couponMessages,
  dealOfDay: dealOfDayMessages,
  featuredDeal: featuredDealMessages,
  offer: offerMessages,
  terms: termsMessages,
  pages: pagesMessages,
  pagesSettings: pagesSettingsMessages,
  socialMedia: socialMediaMessages,
  requests: requestsMessages,
  paymentMethods: paymentMethodsMessages,
  "content-management-system": contentManagementSystemMessages,
});
