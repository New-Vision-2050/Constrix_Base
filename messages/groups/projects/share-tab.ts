import { MessagesGroup, _m } from "../../types";

export const projectShareTabMessages = new MessagesGroup({
  searchPlaceholder: _m("Search shares", "البحث في المشاركات"),
  sort: _m("Sort", "ترتيب"),
  inviteCompany: _m("Invite company", "دعوة شركة"),
  loadError: _m(
    "An error occurred while loading data",
    "حدث خطأ أثناء تحميل البيانات",
  ),
  emptyDash: _m("—", "—"),
  table: new MessagesGroup({
    companyName: _m("Company name", "اسم الشركة"),
    type: _m("Type", "النوع"),
    relation: _m("Relation", "العلاقة"),
    role: _m("Role", "الدور"),
    email: _m("Email", "البريد الإلكتروني"),
    mobile: _m("Mobile number", "رقم الجوال"),
    sharedBy: _m("Company representative", "ممثل الشركة"),
    sentDate: _m("Sent date", "تاريخ الإرسال"),
    requestStatus: _m("Request status", "حالة الطلب"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "إجراء"),
    edit: _m("Edit", "تعديل"),
  }),
  status: new MessagesGroup({
    pending: _m("Awaiting response", "بانتظار الرد"),
    sent: _m("Sent", "تم الإرسال"),
    draft: _m("Under construction", "تحت الإنشاء"),
    under_construction: _m("Under construction", "تحت الإنشاء"),
    accepted: _m("Accepted", "مقبول"),
    approved: _m("Approved", "مقبول"),
    rejected: _m("Rejected", "مرفوض"),
  }),
  widgets: new MessagesGroup({
    awaiting: _m("Awaiting response", "بانتظار الرد"),
    rejected: _m("Rejected", "مرفوض"),
    accepted: _m("Accepted", "مقبول"),
    inProgress: _m("In progress", "قيد المعالجة"),
    total: _m("Total", "الإجمالي"),
  }),
  dialog: new MessagesGroup({
    validation: new MessagesGroup({
      companySerialRequired: _m(
        "Company serial number is required",
        "الرقم التسلسلي للشركة مطلوب",
      ),
      chooseAtLeastOneSection: _m(
        "Please select at least one section",
        "يرجى اختيار قسم واحد على الأقل",
      ),
      searchCompanyFirst: _m(
        "Please search for the company first",
        "يرجى البحث عن الشركة أولاً",
      ),
    }),
    errors: new MessagesGroup({
      companyNotFound: _m("Company not found", "الشركة غير موجودة"),
      shareFailed: _m("An error occurred while sharing", "حدث خطأ أثناء المشاركة"),
      ownCompanyShare: _m(
        "You cannot share a project with your own company",
        "لا يمكن مشاركة المشروع مع شركتك",
      ),
      alreadyShared: _m(
        "This company has already been shared with",
        "تمت المشاركة مع هذه الشركة مسبقاً",
      ),
    }),
    success: new MessagesGroup({
      sharedSuccessfully: _m(
        "Project shared successfully",
        "تمت المشاركة بنجاح",
      ),
    }),
    steps: new MessagesGroup({
      searchCompany: _m("Search company", "البحث عن شركة"),
      confirmCompany: _m("Confirm company", "تأكيد الشركة"),
      definePermissions: _m("Define permissions", "تحديد الصلاحيات"),
      reviewAndSend: _m("Review and send", "المراجعة والإرسال"),
    }),
    labels: new MessagesGroup({
      missingProjectType: _m("Project type is missing", "نوع المشروع مفقود"),
      companySerialNumber: _m("Company serial number", "الرقم التسلسلي للشركة"),
      enterSerialToSearch: _m(
        "Enter serial number to search",
        "أدخل الرقم التسلسلي للبحث",
      ),
      companyDataAfterSearch: _m(
        "Company data will appear only after search",
        "لن تظهر بيانات الشركة إلا بعد البحث",
      ),
      selectedCompany: _m("Selected company: {name}", "الشركة المختارة: {name}"),
      foundCompanyDetails: _m(
        "Found company details",
        "تفاصيل الشركة التي تم العثور عليها",
      ),
      confirmData: _m("Confirm data", "تأكيد البيانات"),
      noCompanyData: _m(
        "No company data. Go back and complete the search.",
        "لا توجد بيانات شركة. ارجع للخطوة السابقة وأكمل البحث.",
      ),
      loadingSections: _m("Loading sections...", "جاري تحميل الأقسام..."),
      noSectionsAvailable: _m("No sections available", "لا توجد أقسام متاحة"),
      type: _m("Type", "النوع"),
      relation: _m("Relation", "العلاقة"),
      role: _m("Role", "الدور"),
      selectGrantedPermissions: _m(
        "Select granted permissions",
        "حدد الصلاحيات الممنوحة",
      ),
      companyInfo: _m("Company information", "معلومات الشركة"),
      selectedPermissions: _m("Selected permissions", "الصلاحيات المختارة"),
      shareTypeRelationRole: _m(
        "Share type, relation and role",
        "نوع المشاركة والعلاقة والدور",
      ),
      reviewBeforeSend: _m(
        "Please review data and permissions before sending the invitation",
        "يرجى مراجعة البيانات والصلاحيات قبل إرسال الدعوة",
      ),
      shareProject: _m("Share project", "مشاركة المشروع"),
      companyName: _m("Company name", "اسم الشركة"),
      serialNumber: _m("Serial number", "الرقم التسلسلي"),
      email: _m("Email", "البريد الإلكتروني"),
      ownerName: _m("Company owner", "مالك الشركة"),
      companyRepresentative: _m("Company representative", "ممثل الشركة"),
    }),
    actions: new MessagesGroup({
      cancel: _m("Cancel", "إلغاء"),
      search: _m("Search", "بحث"),
      back: _m("Back", "رجوع"),
      undo: _m("Undo", "تراجع"),
      next: _m("Next", "التالي"),
      sendInvitation: _m("Send invitation", "إرسال الدعوة"),
      sending: _m("Sending...", "جاري الإرسال..."),
    }),
  }),
});
