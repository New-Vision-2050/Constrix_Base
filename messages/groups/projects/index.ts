import { MessagesGroup, _m } from "../../types";
import { projectSettingsMessages } from "./settings";

export const projectMessages = new MessagesGroup({
  Settings: projectSettingsMessages,
  addProject: _m("Add Project", "إضافة مشروع"),
  editProject: _m("Edit Project", "تعديل مشروع"),
  save: _m("Save", "حفظ"),
  cancel: _m("Cancel", "إلغاء"),
  projectType: _m("Project Type", "نوع المشروع"),
  projectTypeRequired: _m("Project type is required", "نوع المشروع مطلوب"),
  subProjectType: _m("Sub Project Type", "النوع الفرعي للمشروع"),
  subProjectTypeRequired: _m(
    "Sub project type is required",
    "النوع الفرعي للمشروع مطلوب"
  ),
  subSubProjectType: _m("Sub Sub Project Type", "النوع الفرعي الثانوي للمشروع"),
  projectName: _m("Project Name", "اسم المشروع"),
  projectNameRequired: _m("Project name is required", "اسم المشروع مطلوب"),
  branch: _m("Branch", "الفرع"),
  branchRequired: _m("Branch is required", "الفرع مطلوب"),
  management: _m("Management", "الإدارة"),
  managementRequired: _m("Management is required", "الإدارة مطلوبة"),
  managementDirector: _m("Management Director", "مدير الإدارة"),
  projectManager: _m("Project Manager", "مدير المشروع"),
  projectOwner: _m("Project Owner", "مالك المشروع"),
  entity: _m("Entity", "جهة"),
  individual: _m("Individual", "فرد"),
  selectClient: _m("Select Client", "اختر العميل"),
  clientRequired: _m("Client is required", "العميل مطلوب"),
  tableActions: _m("Actions", "الإجراءات"),
  filterSearch: _m("Filter & Search", "التصفية والبحث"),
  projectClassification: _m("Project Classification", "تصنيف المشروع"),
  all: _m("All", "الكل"),
  projectStatus: _m("Project Status", "حالة المشروع"),
  statusOngoing: _m("Ongoing", "جاري"),
  statusInProgress: _m("In Progress", "قيد التنفيذ"),
  statusStopped: _m("Stopped", "متوقف"),
  statusCompleted: _m("Completed", "مكتمل"),
  deleteConfirm: _m(
    "Are you sure you want to delete this project?",
    "هل أنت متأكد من حذف هذا المشروع؟"
  ),
  columnRefNumber: _m("Ref. No.", "الرقم المرجعي"),
  columnClientName: _m("Client name", "اسم العميل"),
  columnResponsibleEngineer: _m(
    "Responsible engineer",
    "المهندس المسؤول"
  ),
  columnContractNumber: _m("Contract number", "رقم العقد"),
  columnProjectStart: _m("Project start", "بداية المشروع"),
  columnProjectEnd: _m("Project end", "نهاية المشروع"),
  columnTimeProgress: _m("Time progress", "التقدم الزمني"),
  columnAchievement: _m("Achievement", "الإنجاز"),
  columnProjectView: _m("Project view", "عرض المشروع"),
  columnBranchAffiliated: _m("Affiliated branch", "الفرع التابع"),
  columnSubSubClassification: _m("Sub-classification", "التصنيف الفرعي"),
  emptyCell: _m("—", "—"),
  share: new MessagesGroup({
    searchTypePlaceholder: _m("Type", "النوع"),
    add: _m("Add", "إضافة"),
    sort: _m("Sort", "ترتيب"),
    companyName: _m("Company name", "اسم الشركة"),
    email: _m("Email", "البريد الإلكتروني"),
    mobile: _m("Mobile", "الجوال"),
    companyRepresentative: _m("Company representative", "ممثل الشركة"),
    sharedUser: _m("Shared with", "المستخدم"),
    assignedAt: _m("Assigned at", "تاريخ الإسناد"),
    assignedBy: _m("Assigned by", "أُسند بواسطة"),
    sentDate: _m("Sent date", "تاريخ الإرسال"),
    inviteCompany: _m("Invite new company", "دعوة شركة جديدة"),
    widgetTotal: _m("Total companies", "إجمالي الشركات"),
    widgetInProgress: _m("In progress", "تحت الاجراء"),
    widgetAccepted: _m("Accepted", "مقبولة"),
    widgetRejected: _m("Rejected", "مرفوضة"),
    widgetAwaiting: _m("Awaiting response", "بانتظار الرد"),
    loadSharesError: _m(
      "Could not load shared project list.",
      "تعذر تحميل قائمة المشاركات."
    ),
    statusSent: _m("Sent", "تم الإرسال"),
    statusDraft: _m("Draft", "تحت الإنشاء"),
    statusAccepted: _m("Accepted", "مقبول"),
    statusRejected: _m("Rejected", "مرفوض"),
    requestStatus: _m("Request status", "حالة الطلب"),
    columnActions: _m("Actions", "الإجراءات"),
    actionMenu: _m("Action", "إجراء"),
    edit: _m("Edit", "تعديل"),
    statusPending: _m("In progress", "تحت الاجراء"),
    dialogTitle: _m("Share", "مشاركة"),
    dialogSearch: _m("Search", "بحث"),
    dialogCompanySearchPlaceholder: _m(
      "Company name",
      "اسم الشركة"
    ),
    dialogSerialSearchPlaceholder: _m(
      "Enter company serial number",
      "أدخل الرقم التعريفي للشركة"
    ),
    schemasSectionTitle: _m(
      "Sections to share",
      "أقسام المشروع للمشاركة"
    ),
    noSchemasAvailable: _m(
      "No shareable sections are configured for this project type.",
      "لا توجد أقسام متاحة للمشاركة لهذا النوع من المشروع."
    ),
    projectTypeMissing: _m(
      "Project classification is missing; cannot load sections.",
      "تعذر تحميل الأقسام لأن تصنيف المشروع غير مكتمل."
    ),
    loadingSchemas: _m("Loading sections…", "جاري تحميل الأقسام…"),
    dialogSelectedCompany: _m("Company name: {name}", "اسم الشركة: {name}"),
    dialogShareSubmit: _m("Share", "مشاركة"),
    tabProjectData: _m("Project data", "بيانات المشروع"),
    tabWorkspace: _m("Workspace", "مساحة العمل"),
    tabAttachments: _m("Attachments", "المرفقات"),
    tabContractors: _m("Contractors", "المقاولين"),
    tabStaff: _m("Staff", "الكادر"),
    tabWorkOrders: _m("Work orders", "أوامر العمل"),
    tabContractManagement: _m(
      "Contract management",
      "إدارات العقد"
    ),
    tabFinancial: _m("Financial", "المالية"),
    companySerialNumber: _m("Company serial number", "الرقم التعريفي للشركة"),
    notes: _m("Notes", "ملاحظات"),
    notesPlaceholder: _m(
      "Optional notes for the recipient",
      "ملاحظات اختيارية للجهة المستلمة"
    ),
    confirmShareTitle: _m("Confirm sharing", "تأكيد المشاركة"),
    confirmShareMessage: _m(
      "The sharing request will be sent to the requested party.",
      "سيتم إرسال طلب المشاركة إلى الجهة المطلوبة"
    ),
    confirmApprove: _m("Approve", "موافقة"),
    shareSuccess: _m("Share request sent", "تم إرسال طلب المشاركة"),
    shareError: _m("Could not send share request", "تعذر إرسال طلب المشاركة"),
    alreadySharedWithCompany: _m(
      "This project has already been shared with this company.",
      "تم مشاركة هذا المشروع مع هذه الشركة مسبقاً."
    ),
    companyNotFound: _m(
      "No company was found for this serial number.",
      "لم يتم العثور على شركة بهذا الرقم التعريفي."
    ),
    validation: new MessagesGroup({
      selectCompanyFirst: _m(
        "Search and select a company first",
        "ابحث واختر شركة أولاً"
      ),
      selectSection: _m(
        "Select at least one section to share",
        "اختر قسماً واحداً على الأقل للمشاركة"
      ),
      companySerialRequired: _m(
        "Company serial number is required",
        "الرقم التعريفي للشركة مطلوب"
      ),
      companyLookupRequired: _m(
        "Search for the company by serial number first",
        "ابحث عن الشركة بالرقم التعريفي أولاً"
      ),
    }),
  }),
  inbox: new MessagesGroup({
    title: _m("Inbox", "صندوق الوارد"),
    accept: _m("Accept", "قبول"),
    reject: _m("Reject", "رفض"),
    actionMenu: _m("Action", "إجراء"),
    loadError: _m("Could not load invitations.", "تعذر تحميل الدعوات."),
    acceptSuccess: _m("Invitation accepted.", "تم قبول الدعوة."),
    rejectSuccess: _m("Invitation rejected.", "تم رفض الدعوة."),
    mutationError: _m("Could not update invitation.", "تعذر تنفيذ الإجراء."),
    columnType: _m("Type", "النوع"),
    columnName: _m("Name", "الاسم"),
    columnSenderCompany: _m("Sender company", "الجهة الراسلة"),
    columnReference: _m("Reference / ID", "المرجع أو المعرف"),
    columnRepresentative: _m("Representative", "الممثل"),
    columnDateSent: _m("Date sent", "تاريخ الإرسال"),
    columnStatus: _m("Status", "الحالة"),
    typeProject: _m("Project", "مشروع"),
    typeAttachment: _m("Attachment", "مرفق"),
    typeRequest: _m("Request", "طلب"),
    typeQuote: _m("Quote", "عرض سعر"),
    filterDocumentType: _m("Document type", "نوع المستند"),
    filterStatus: _m("Status", "الحالة"),
    filterSortBy: _m("Sort by", "ترتيب حسب"),
    filterAll: _m("All", "الكل"),
    filterStatusAll: _m("All statuses", "كل الحالات"),
    filterStatusAwaiting: _m("Awaiting response", "بانتظار الرد"),
    filterStatusInProgress: _m("In progress", "تحت الإجراء"),
    filterStatusAccepted: _m("Accepted", "مقبولة"),
    filterStatusRejected: _m("Rejected", "مرفوضة"),
    sortDateNewest: _m("Date — newest", "التاريخ — الأحدث"),
    sortDateOldest: _m("Date — oldest", "التاريخ — الأقدم"),
    sortNameAsc: _m("Name — A to Z", "الاسم — أ إلى ي"),
    sortNameDesc: _m("Name — Z to A", "الاسم — ي إلى أ"),
    searchInInbox: _m("Search in inbox", "بحث في الوارد"),
    widgetTotal: _m("Total", "الإجمالي"),
    widgetInProgress: _m("In progress", "تحت الإجراء"),
    widgetAccepted: _m("Accepted", "مقبولة"),
    widgetRejected: _m("Rejected", "مرفوضة"),
    widgetAwaiting: _m("Awaiting response", "بانتظار الرد"),
    viewDetails: _m("View details", "عرض التفاصيل"),
    detailsTitle: _m("Inbox details", "تفاصيل الوارد"),
    detailsSubtitle: _m(
      "Review the request details and choose an action.",
      "مراجعة تفاصيل الوارد واتخاذ الإجراء المناسب"
    ),
    detailsFieldType: _m("Type", "النوع"),
    detailsFieldCurrentApproval: _m("Current status", "الموافقة الحالية"),
    detailsFieldSubmissionDate: _m("Submission date", "تاريخ التقديم"),
    detailsApprovalPath: _m("Approval path", "مسار الاعتماد"),
    detailsStepSubmission: _m("Submission", "تقديم"),
    detailsStepInitialReview: _m("Initial review", "مراجعة أولية"),
    detailsStepTechnical: _m("Technical approval", "اعتماد فني"),
    detailsStepCommercial: _m("Commercial approval", "موافقة تجارية"),
    detailsComments: _m("Comments", "التعليقات"),
    detailsNoComments: _m("No comments yet.", "لا توجد تعليقات."),
    detailsDescription: _m("Description", "الوصف"),
    detailsSelectedSections: _m("Selected sections", "الصلاحيات المختارة"),
    detailsNoSections: _m("No sections listed.", "لا توجد أقسام محددة."),
    detailsAttachments: _m("Attachments", "المرفقات"),
    detailsNoAttachments: _m("No attachments.", "لا توجد مرفقات."),
    detailsRequestModification: _m("Request modification", "طلب تعديل"),
    detailsPartialApprove: _m("Partially approved", "معتمد جزئي"),
    detailsStepMetaSample: _m("Ahmed Ali — 2024/06/01", "أحمد علي — 2024/06/01"),
    detailsStepMetaSample2: _m("Review team — 2024/06/03", "فريق المراجعة — 2024/06/03"),
    detailsCommentSampleAuthor: _m("Ahmed Ali · 2024/06/02 10:30", "أحمد علي · 2024/06/02 10:30"),
    detailsAttachmentSampleName: _m("Template bundle", "مجمع القالب"),
    mockDataBanner: _m(
      "Demo mode: inbox list uses mock data. Set NEXT_PUBLIC_INBOX_MOCK=0 or turn off INBOX_FORCE_MOCK to use the API. Accept/reject still call the server.",
      "وضع تجريبي: قائمة الوارد تعرض بيانات وهمية. عطّل NEXT_PUBLIC_INBOX_MOCK أو INBOX_FORCE_MOCK لاستخدام الـ API. قبول/رفض ما زال يتصل بالخادم."
    ),
  }),
});
