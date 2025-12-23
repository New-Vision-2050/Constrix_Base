import { _m, MessagesGroup } from "../../types";

export const companiesMessages = new MessagesGroup({
  Companies: _m("Companies", "الشركات"),
  Edit: _m("Edit", "تعديل"),
  Email: _m("Email", "البريد الالكتروني"),
  CompanyType: _m("Company Type", "نوع الشركة"),
  CompanySection: _m("Company Section", "نشاط الشركه"),
  Manager: _m("Manager", "المسؤول"),
  DataStatus: _m("Data Status", "حالة البيانات"),
  Status: _m("Status", "الحالة"),
  Actions: _m("Actions", "الاجراء"),
  CountryFilter: _m("Company Country", "دولة الشركة"),
  TypeFilter: _m("Company Type", "نوع الشركة"),
  Active: _m("Active", "نشط"),
  Inactive: _m("Inactive", "غير نشط"),
  LoginAsManager: _m("Login as Company Manager (Edit)", "الدخول كـ مدير شركة (تعديل)"),
  completeProfileData: _m("complete profile data", "أستكمال بيانات"),
  PackageSettings: _m("Package and Program Settings", "اعدادات الباقة والبرامج"),
  Delete: _m("Delete (Archive)", "حذف (أرشفة)"),
  Confirmation: _m("Confirmation", "تأكيد"),
  AreYouSure: _m("Are you sure?", "هل أنت متأكد؟"),
  AreYouSureReactivate: _m("Do you want to confirm activating the company?", "هل تريد تاكيد تنشيط الشركة؟"),
  AreYouSureDeactivate: _m("Do you want to confirm deactivating the company?", "هل تريد تاكيد الغاء تنشيط الشركة؟"),
  DeleteConfirmMessage: _m("Are you sure you want to delete this company?", "هل أنت متأكد من حذف هذه الشركة؟"),
  createCompany: _m("Create Company", "انشاء شركة"),
  SaveCompany: _m("The company was saved with number", "تم حفظ الشركة برقم"),
  Validation: new MessagesGroup({
    englishName: _m("Short name should be in English", "الاسم المختصر يجب ان يكون باللغه الانجليزية"),
    arabicName: _m("The name should be in Arabic letters", "الاسم التجاري يجب ان يكون باللغه العربية"),
    arabicFirstName: _m("The first name should be in Arabic letters", "اسم المستخدم الاول يجب ان يكون باللغه العربية"),
    arabicLastName: _m("The last name should be in Arabic letters", "اسم المستخدم الأخير يجب ان يكون باللغه العربية")
  }),
  // sub entities table
  SubEntitiesTable: new MessagesGroup({
    Name: _m("Name", "الاسم"),
    JobTitle: _m("Job Title", "المسمى الوظيفي"),
    ResidenceNumber: _m("Residence Number", "رقم الهوية"),
    Phone: _m("Phone", "رقم الجوال"),
    Branch: _m("Branch", "الفرع"),
    Broker: _m("Broker", "الوسيط"),
    NumberOfProjects: _m("Number of Projects", "عدد المشاريع"),
    Company: _m("Company", "الشركة"),
    ContractEndDate: _m("Contract End Date", "تاريخ نهاية العقد"),
    UserType: _m("User Type", "نوع المستخدم"),
    CompleteProfile: _m("Complete Profile", "اكمال الملف الشخصي"),
    CompleteClientProfile: _m("Complete Client Profile", "أكمال ملف العميل"),
    CompleteBrokerProfile: _m("Complete Broker Profile", "أكمال ملف الوسيط"),
    ClientSettings: _m("Client Settings", "اعدادات العميل"),
    BrokerSettings: _m("Broker Settings", "اعدادات الوسيط"),
    EmployeeSettings: _m("Employee Settings", "اعدادات الموظف"),
    Delete: _m("Delete", "حذف"),
    EmailOrPhone: _m("Email / Phone", "البريد الإليكتروني / الجوال"),
    UserStatus: _m("User Status", "حالة المستخدم"),
  }),
  // sub entities form
  SubEntitiesForm: new MessagesGroup({
    // Form titles
    AddEmployee: _m("Add Employee", "اضافة"),
    
    // Email field
    Email: _m("Email", "البريد الإلكتروني"),
    EnterEmail: _m("Enter Email", "ادخل البريد الإلكتروني"),
    EmailRequired: _m("Email is required", "البريد الإلكتروني مطلوب"),
    InvalidEmail: _m("Please enter a valid email address.", "يرجى إدخال عنوان بريد إلكتروني صالح."),
    EmailAlreadyAdded: _m("The email below has been added previously", "البريد الإلكتروني أدناه مضاف مسبقًا"),
    
    // Name fields
    FirstName: _m("First Name", "اسم الموظف الاول"),
    EnterFirstName: _m("Enter First Name", "ادخل اسم الموظف الاول"),
    FirstNameRequired: _m("First name is required", "اسم الموظف الاول مطلوب"),
    LastName: _m("Last Name", "اسم الموظف الأخير"),
    EnterLastName: _m("Enter Last Name", "اسم الموظف الأخير"),
    LastNameRequired: _m("Last name is required", "الاسم مطلوب"),
    NameMinLength: _m("Name must contain at least two characters.", "الاسم يجب أن يحتوي على حرفين على الأقل."),
    
    // Country field
    Nationality: _m("Nationality", "الجنسية"),
    ChooseNationality: _m("Choose Nationality", "اختر الجنسية"),
    NationalityRequired: _m("Nationality is required", "الجنسية مطلوب"),
    
    // Phone field
    Phone: _m("Phone", "الهاتف"),
    EnterPhone: _m("Please enter your phone number.", "يرجى إدخال رقم هاتفك."),
    PhoneRequired: _m("Phone number is required", "رقم الهاتف مطلوب"),
    InvalidPhone: _m("Invalid phone number", "رقم الهاتف غير صحيح"),
    
    // Job title field
    JobTitle: _m("Job Title", "المسمى الوظيفي"),
    ChooseJobTitle: _m("Choose Job Title", "اختر المسمى الوظيفي"),
    
    // Branch field
    Branch: _m("Branch", "الفرع"),
    ChooseBranch: _m("Choose Branch", "اختر الفرع"),
    
    // Status field
    EmployeeStatus: _m("Employee Status", "حالة الموظف"),
    ChooseEmployeeStatus: _m("Choose Employee Status", "اختر حالة الموظف"),
    Active: _m("Active", "نشط"),
    Inactive: _m("Inactive", "غير نشط"),
    
    // Buttons
    Save: _m("Save", "حفظ"),
    Cancel: _m("Cancel", "إلغاء"),
    ClearForm: _m("Clear Form", "مسح النموذج"),
  }),
  // retrieve employee data
  RetrieveEmployeeData: new MessagesGroup({
    EmployeeAlreadyAdded: _m("The employee below has been added previously", "الموظف أدناه مضاف مسبقًا"),
    EmailAlreadyAdded: _m("The email below has been added previously", "البريد الإلكتروني أدناه مضاف مسبقًا"),
    EmployeeRegisteredInAnotherCompany: _m("The employee is registered with another company", "الموظف مسجل لدي شركة أخري"),
    ClickHereToRetrieve: _m("Click here to retrieve", "أضغط هنا لأسترجاع"),
    EmailRegisteredAsEmployee: _m("The email is already registered as an employee in the company", "الأيميل مسجل كموظف مسبقأ فى الشركة"),
    EmailRegisteredPreviously: _m("The email is already registered with the company", "البريد الإلكتروني مسجل مسبقا لدي الشركة"),
    AsClientInBranches: _m("as a client in the following branches", "كعميل لدي الأفرع الأتية"),
    AsBrokerInBranches: _m("as a broker in the following branches", "كوسيط لدي الأفرع الأتية"),
    EmployeeAlreadyRegistered: _m("The employee is already registered in the company", "الموظف مسجل بالفعل فى الشركة مسبقأ"),
    ClickToAddToAnotherBranch: _m("Click here to add as employee to another branch", "لأضافته لفرع أخر كموظف أضغط هنا"),
  }),
  // add company form
  AddCompanyForm: new MessagesGroup({
    Title: _m("Add New Company", "اضافة شركة جديدة"),
    CreateCompanySectionTitle: _m("Create Company", "إنشاء شركة"),
    CountryLabel: _m("Company Country", "دولة الشركة"),
    CountryPlaceholder: _m("Select company country", "اختر دولة الشركة"),
    CountryRequired: _m("Company country is required", "ادخل دولة الشركة"),
    CompanyFieldLabel: _m("Company Activity", "النشاط"),
    CompanyFieldPlaceholder: _m("Select activity", "اختر النشاط"),
    CompanyFieldRequired: _m("Please choose an activity", "برجاء اختيار النشاط"),
    TradeNameLabel: _m("Trade Name", "الاسم التجاري"),
    TradeNamePlaceholder: _m("Enter trade name", "برجاء إدخال الاسم التجاري"),
    TradeNameApiMessage: _m(
      "Trade name must be in Arabic",
      "الاسم التجاري يجب ان يكون باللغة العربية"
    ),
    ShortNameLabel: _m("Short Name", "الاسم المختصر"),
    ShortNamePlaceholder: _m("Enter short name", "برجاء إدخال الاسم المختصر"),
    ShortNameRequired: _m("Short name is required", "ادخل الاسم المختصر"),
    ShortNameApiMessage: _m(
      "Short name must be English letters only",
      "الاسم المختصر يجب ان يكون بالغة الانجليزية ولا يتخلله رموز"
    ),
    SupportManagerLabel: _m("Support Manager", "مسؤول الدعم"),
    SupportManagerPlaceholder: _m("Select support manager", "اختر مسؤول الدعم"),
    SupportManagerRequired: _m("Support manager is required", "اختر مسؤول الدعم"),
    CompanyCheckboxLabel: _m("Company", "الشركة"),
    CompanyCheckboxPlaceholder: _m("Select company", "اختر الشركة"),
    CreateUserSectionTitle: _m("Create User", "إنشاء مستخدم"),
    CompanyIdLabel: _m("Company", "الشركة"),
    CompanyIdPlaceholder: _m("Select company", "اختر الشركة"),
    CompanyIdRequired: _m("Company is required", "الشركة"),
    FirstNameLabel: _m("First Name", "اسم المستخدم الاول"),
    FirstNamePlaceholder: _m("Enter first name", "ادخل اسم المستخدم الاول"),
    FirstNameRequired: _m("First name is required", "اسم المستخدم الاول مطلوب"),
    NameMinLength: _m(
      "Name must be at least 2 characters",
      "الاسم يجب أن يحتوي على حرفين على الأقل"
    ),
    LastNameLabel: _m("Last Name", "اسم المستخدم الأخير"),
    LastNamePlaceholder: _m("Enter last name", "اسم المستخدم الأخير"),
    LastNameRequired: _m("Last name is required", "الاسم مطلوب"),
    EmailLabel: _m("Email", "البريد الإلكتروني"),
    EmailPlaceholder: _m("Enter email", "ادخل البريد الإلكتروني"),
    EmailRequired: _m("Email is required", "البريد الإلكتروني مطلوب"),
    EmailInvalid: _m("Please enter a valid email address", "يرجى إدخال بريد إلكتروني صالح"),
    PhoneLabel: _m("Phone", "الهاتف"),
    PhonePlaceholder: _m("Enter phone number", "أدخل رقم الجوال"),
    PhoneInvalid: _m("Invalid phone number", "رقم هاتف غير صالح"),
    JobTitleLabel: _m("Job Title", "المسمى الوظيفي"),
    JobTitlePlaceholder: _m("Select job title", "اختر المسمى الوظيفي"),
    JobTitleRequired: _m("Job title is required", "المسمى الوظيفي"),
    SubmitButtonText: _m("Send Message", "إرسال"),
    CancelButtonText: _m("Cancel", "إلغاء"),
    ResetButtonText: _m("Clear Form", "مسح النموذج"),
    NextButtonText: _m("Continue", "التالي"),
    BackButtonText: _m("Back", "رجوع"),
    FinishButtonText: _m("Save", "حفظ"),
    StepSubmitButtonText: _m("Next", "التالي"),
    TimeZoneCheckbox: new MessagesGroup({
      ConfirmText: _m(
        "To confirm changing the time zone,",
        "لتأكيد تغيير المنطقة الزمنية،"
      ),
      ClickHere: _m("Click here", "اضغط هنا"),
    }),
  })
});
