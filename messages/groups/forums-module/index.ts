import { _m, MessagesGroup } from "../../types";

export const forumsModuleMessages = new MessagesGroup({
  title: _m("Forum management", "إدارة المنتديات"),
  subtitle: _m(
    "Company forums, their groups, and the roles assigned to each forum",
    "منتديات الشركة ومجموعاتها والأدوار المخصصة لكل منتدى",
  ),

  tabs: new MessagesGroup({
    forums: _m("Forums", "المنتديات"),
    announcements: _m("Announcements", "الإعلانات العامة"),
    reports: _m("Reports", "البلاغات"),
  }),

  status: new MessagesGroup({
    draft: _m("Draft", "مسودة"),
    active: _m("Published", "منشور"),
    archived: _m("Archived", "مؤرشف"),
    groupActive: _m("Active", "نشطة"),
    groupArchived: _m("Archived", "مؤرشفة"),
    memberActive: _m("Active", "نشط"),
  }),

  visibility: new MessagesGroup({
    company: _m("All company employees", "كل موظفي الشركة"),
    scoped: _m("Specific managements or projects", "إدارات أو مشاريع محددة"),
  }),

  sendPermission: new MessagesGroup({
    admins_only: _m("Admins only", "الأدمنز فقط"),
    all_members: _m("All members", "كل الأعضاء"),
    specific_members: _m("Specific employees", "موظفون محددون"),
  }),

  media: new MessagesGroup({
    images: _m("Images", "الصور"),
    voice: _m("Voice", "الصوت"),
    files: _m("Files", "الملفات"),
    none: _m("Text only", "النص فقط"),
  }),

  roles: new MessagesGroup({
    forumAdmin: _m("Forum admin", "أدمن المنتدى"),
    groupAdmin: _m("Group admin", "أدمن مجموعة"),
    admin: _m("Admin", "أدمن"),
    member: _m("Member", "عضو"),
  }),

  common: new MessagesGroup({
    search: _m("Search", "بحث"),
    all: _m("All", "الكل"),
    manage: _m("Manage", "إدارة"),
    action: _m("Action", "إجراء"),
    actions: _m("Actions", "الإجراءات"),
    cancel: _m("Cancel", "إلغاء"),
    save: _m("Save", "حفظ"),
    next: _m("Next", "التالي"),
    previous: _m("Previous", "السابق"),
    saveDraft: _m("Save as draft", "حفظ كمسودة"),
    confirm: _m("Confirm", "تأكيد"),
    view: _m("View", "عرض"),
    remove: _m("Remove", "إزالة"),
    edit: _m("Edit", "تعديل"),
    delete: _m("Delete", "حذف"),
    archive: _m("Archive", "أرشفة"),
    restore: _m("Restore", "استعادة"),
    status: _m("Status", "الحالة"),
    date: _m("Date", "التاريخ"),
    employeeName: _m("Employee name", "اسم الموظف"),
    employeeNumber: _m("Employee no.", "رقم الموظف"),
    management: _m("Management", "الإدارة"),
    role: _m("Role", "الدور"),
    groups: _m("Groups", "المجموعات"),
    members: _m("Members", "الأعضاء"),
    admins: _m("Admins", "الأدمنز"),
    allManagements: _m("All managements", "كل الإدارات"),
    allProjects: _m("All projects", "كل المشاريع"),
    allGroups: _m("All groups", "كل المجموعات"),
    allStatuses: _m("All statuses", "كل الحالات"),
    allRoles: _m("All roles", "كل الأدوار"),
    allPublishers: _m("All publishers", "كل الناشرين"),
    allActions: _m("All actions", "كل الإجراءات"),
    allOwners: _m("All owners", "كل المسؤولين"),
    searchEmployee: _m("Search for an employee", "البحث عن موظف"),
    searchEmployeePlaceholder: _m(
      "Search by name or employee number",
      "ابحث بالاسم أو الرقم الوظيفي",
    ),
    pngOrJpg: _m("PNG or JPG", "PNG أو JPG"),
    noResults: _m("No results", "لا توجد نتائج"),
    noData: _m("No data", "لا توجد بيانات"),
    close: _m("Close", "إغلاق"),
    loadFailed: _m("Could not load the data", "تعذر تحميل البيانات"),
    saveFailed: _m("Could not save the changes", "تعذر حفظ التغييرات"),
    saved: _m("Changes saved", "تم حفظ التغييرات"),
    groupsCount: _m("{count} groups", "{count} مجموعات"),
    project: _m("Project", "المشروع"),
    company: _m("Company", "الشركة"),
    forum: _m("Forum", "المنتدى"),
    requiredField: _m("This field is required", "هذا الحقل مطلوب"),
    enabled: _m("Enabled", "مفعّل"),
    disabled: _m("Disabled", "غير مفعّل"),
  }),

  list: new MessagesGroup({
    create: _m("Create forum", "إنشاء منتدى"),
    searchPlaceholder: _m("Search by forum name", "ابحث باسم المنتدى"),
    stats: new MessagesGroup({
      total: _m("Total forums", "إجمالي المنتديات"),
      published: _m("Published forums", "منتديات منشورة"),
      publishedHint: _m(
        "Available in the employee app",
        "متاحة في تطبيق الموظفين",
      ),
      drafts: _m("Drafts", "مسودات"),
      draftsHint: _m("Ready for review", "جاهزة للمراجعة"),
      archived: _m("Archived forums", "منتديات مؤرشفة"),
      archivedHint: _m("Kept in the archive", "محفوظة في الأرشيف"),
    }),
    columns: new MessagesGroup({
      name: _m("Forum name", "اسم المنتدى"),
      company: _m("Company", "الشركة"),
      groups: _m("Groups", "المجموعات"),
      members: _m("Members", "الأعضاء"),
      status: _m("Status", "الحالة"),
      lastActivity: _m("Last update", "آخر تحديث"),
    }),
    empty: _m("No forums yet", "لا توجد منتديات بعد"),
    archiveConfirmTitle: _m("Archive this forum?", "أرشفة هذا المنتدى؟"),
    archiveConfirmBody: _m(
      "It stops showing in the employee app and stays recoverable. Groups and messages are kept.",
      "سيتوقف ظهوره في تطبيق الموظفين ويظل قابلًا للاستعادة. المجموعات والرسائل محفوظة.",
    ),
    draftSaved: _m(
      "Saved as a draft",
      "تم الحفظ كمسودة",
    ),
  }),

  wizard: new MessagesGroup({
    titlePrefix: _m("Create forum", "إنشاء منتدى"),
    stepOf: _m("Step {current} of {total}", "الخطوة {current} من {total}"),
    steps: new MessagesGroup({
      basic: _m("Basic data", "البيانات الأساسية"),
      admins: _m("Admins", "الأدمنز"),
      members: _m("Members", "الأعضاء"),
      review: _m("Review", "المراجعة"),
    }),
    basic: new MessagesGroup({
      heading: _m("Basic data", "البيانات الأساسية"),
      hint: _m(
        "Forum data and its visibility scope",
        "بيانات المنتدى ونطاق ظهوره",
      ),
      name: _m("Forum name", "اسم المنتدى"),
      company: _m("Company", "الشركة"),
      description: _m("Forum description", "وصف المنتدى"),
      details: _m("Additional description", "وصف إضافي"),
      logo: _m("Forum image", "صورة المنتدى"),
      visibility: _m("Visibility scope", "نطاق الظهور"),
      visibilityHint: _m(
        "Choose who sees the forum in the employee app.",
        "اختر من يظهر له المنتدى في تطبيق الموظفين.",
      ),
      companyScopeHint: _m(
        "The forum shows for every company employee",
        "يظهر المنتدى لجميع موظفي الشركة",
      ),
      scopedScopeHint: _m(
        "Visibility is limited to employees inside the chosen scope",
        "يقتصر ظهوره على الموظفين ضمن النطاق المحدد",
      ),
      managements: _m("Managements", "الإدارات"),
      projects: _m("Projects", "المشاريع"),
    }),
    admins: new MessagesGroup({
      heading: _m("Assign admins", "تعيين الأدمنز"),
      hint: _m(
        "Choose who is responsible for managing the forum",
        "اختر المسؤولين عن إدارة المنتدى",
      ),
      selected: _m(
        "{count} admins selected for the forum",
        "تم اختيار {count} أدمن للمنتدى",
      ),
      transferHint: _m(
        "Transfer management to another employee before removing the last admin",
        "انقل الإدارة إلى موظف آخر قبل إزالة آخر أدمن",
      ),
      atLeastOne: _m(
        "Pick at least one admin to publish the forum",
        "اختر أدمن واحدًا على الأقل لنشر المنتدى",
      ),
    }),
    members: new MessagesGroup({
      heading: _m("Add members", "إضافة الأعضاء"),
      hint: _m(
        "Choose members from the company employees",
        "اختر الأعضاء من موظفي الشركة",
      ),
      selected: _m("{count} employees selected", "تم تحديد {count} موظفًا"),
      clearSelection: _m("Clear selection", "إزالة التحديد"),
      distributionHint: _m(
        "Distributing members across groups is available after the forum is created",
        "توزيع الأعضاء على المجموعات متاح بعد إنشاء المنتدى",
      ),
      reviewForum: _m("Review forum", "مراجعة المنتدى"),
    }),
    review: new MessagesGroup({
      heading: _m("Review and publish", "مراجعة ونشر"),
      hint: _m(
        "Review what employees will see before publishing",
        "راجع ما سيظهر للموظفين قبل النشر",
      ),
      basicSection: _m("Basic data", "البيانات الأساسية"),
      peopleSection: _m("Admins and members", "الأدمنز والأعضاء"),
      membersValue: _m("{count} employees", "{count} موظفًا"),
      groupsValue: _m(
        "Add them from forum management",
        "أضف من إدارة المنتدى",
      ),
      notify: _m("Notify employees", "إشعار الموظفين"),
      notifyHint: _m(
        "Send a notification to the audience that sees this forum when it is published.",
        "إرسال إشعار للفئة التي يظهر لها المنتدى عند نشره.",
      ),
      publishNote: _m(
        "After publishing, the forum shows in the employee app according to its visibility scope.",
        "بعد النشر يظهر المنتدى في تطبيق الموظفين حسب نطاق الظهور.",
      ),
      publish: _m("Publish forum", "نشر المنتدى"),
    }),
  }),

  forum: new MessagesGroup({
    breadcrumbDetails: _m("Forum details", "تفاصيل المنتدى"),
    allForums: _m("All forums", "كل المنتديات"),
    tabs: new MessagesGroup({
      overview: _m("Overview", "نظرة عامة"),
      groups: _m("Groups", "المجموعات"),
      members: _m("Members", "الأعضاء"),
      admins: _m("Admins", "الأدمنز"),
      settings: _m("Settings", "الإعدادات"),
      activity: _m("Activity log", "سجل النشاط"),
    }),

    overview: new MessagesGroup({
      stats: new MessagesGroup({
        groups: _m("Groups", "المجموعات"),
        groupsHint: _m("Active groups", "مجموعات نشطة"),
        members: _m("Members", "الأعضاء"),
        membersHint: _m("Company employees", "موظفون بالشركة"),
        admins: _m("Forum admins", "أدمنز المنتدى"),
        adminsHint: _m("Forum managers", "مديرو المنتدى"),
        reports: _m("Open reports", "البلاغات المفتوحة"),
        reportsHint: _m("Awaiting review", "بانتظار المراجعة"),
      }),
      sectionTitle: _m("Forum management", "إدارة المنتدى"),
      groupsRow: _m(
        "Create a group and distribute the forum members across it.",
        "أنشئ مجموعة ووزّع أعضاء المنتدى عليها.",
      ),
      membersRow: _m(
        "Add employees or review the groups linked to each member.",
        "أضف موظفين أو راجع المجموعات المرتبطة بكل عضو.",
      ),
      adminsRow: _m(
        "Assign admins and define their roles in the forum.",
        "عيّن الأدمنز وحدّد أدوارهم في المنتدى.",
      ),
      mobilePreview: _m(
        "Preview the forum on mobile",
        "معاينة المنتدى على الموبايل",
      ),
      mobilePreviewHint: _m(
        "A static preview of how the forum appears in the employee app.",
        "معاينة ثابتة لشكل المنتدى في تطبيق الموظفين.",
      ),
    }),

    groups: new MessagesGroup({
      title: _m("Forum groups", "مجموعات المنتدى"),
      breadcrumb: _m("Employee groups", "مجموعات الموظفين"),
      create: _m("Create group", "إنشاء مجموعة"),
      searchPlaceholder: _m("Search by group name", "ابحث باسم المجموعة"),
      statusFilter: _m("Group status", "حالة المجموعة"),
      sendFilter: _m("Sending allowance", "سماح الإرسال"),
      allSendModes: _m("All sending modes", "كل أوضاع الإرسال"),
      stats: new MessagesGroup({
        total: _m("Total groups", "إجمالي المجموعات"),
        totalHint: _m("Inside {forum}", "ضمن {forum}"),
        active: _m("Active groups", "مجموعات نشطة"),
        activeHint: _m(
          "Visible in the employee app",
          "تظهر في تطبيق الموظفين",
        ),
        readOnly: _m("Read-only for members", "للقراءة فقط للأعضاء"),
        readOnlyHint: _m("Admins only can send", "الإرسال للأدمنز فقط"),
        archived: _m("Archived groups", "مجموعات مؤرشفة"),
        archivedHint: _m("Can be restored", "يمكن استعادتها"),
      }),
      columns: new MessagesGroup({
        name: _m("Group name", "اسم المجموعة"),
        members: _m("Members", "الأعضاء"),
        admins: _m("Admins", "الأدمنز"),
        sendPermission: _m("Sending permission", "صلاحية الإرسال"),
        media: _m("Allowed media", "الوسائط المتاحة"),
      }),
      menu: new MessagesGroup({
        manage: _m("Manage", "إدارة"),
        editData: _m("Edit data", "تعديل البيانات"),
        sendSettings: _m("Sending permissions", "صلاحيات الإرسال"),
        archive: _m("Archive", "أرشفة"),
        restore: _m("Restore", "استعادة"),
        delete: _m("Delete", "حذف"),
      }),
      empty: _m("No groups in this forum yet", "لا توجد مجموعات في هذا المنتدى بعد"),
      archiveConfirm: _m(
        "The group stops showing in the employee app and stays recoverable.",
        "تتوقف المجموعة عن الظهور في تطبيق الموظفين وتظل قابلة للاستعادة.",
      ),
      deleteConfirm: _m(
        "The group and its membership are permanently deleted.",
        "سيتم حذف المجموعة وعضويتها نهائيًا.",
      ),
    }),

    groupModal: new MessagesGroup({
      title: _m("Group data", "بيانات المجموعة"),
      subtitle: _m("Create or edit a group", "إنشاء أو تعديل مجموعة"),
      name: _m("Group name", "اسم المجموعة"),
      description: _m("Group description", "وصف المجموعة"),
      icon: _m("Group image", "صورة المجموعة"),
      iconHint: _m(
        "An image shown next to the group name in the employee app",
        "صورة تظهر بجانب اسم المجموعة في تطبيق الموظفين",
      ),
      sortOrder: _m("Display order", "ترتيب العرض"),
      showName: _m("Show the group name in the forum", "عرض اسم المجموعة في المنتدى"),
      showNameHint: _m(
        "Shown to every employee added to the group",
        "تظهر لكل موظف مضاف للمجموعة",
      ),
      status: _m("Group status", "حالة المجموعة"),
      category: _m("Group category", "فئة المجموعة"),
      footerHint: _m(
        "Add the group members and assign its admin after saving the data.",
        "أضف أعضاء المجموعة وعيّن أدمنها بعد حفظ البيانات.",
      ),
      submit: _m("Save and go to members", "حفظ والانتقال للأعضاء"),
    }),

    groupMembers: new MessagesGroup({
      title: _m("Members of {group}", "أعضاء مجموعة {group}"),
      save: _m("Save members", "حفظ الأعضاء"),
      bulkTitle: _m("Bulk actions", "الإجراءات الجماعية"),
      changeRole: _m("Change role", "تغيير الدور"),
      removeSelected: _m("Remove selected members", "إزالة أعضاء محددين"),
      addSelected: _m("Add selected members", "إضافة أعضاء محددين"),
      bulkHint: _m(
        "An employee can be made admin of this group from the action menu in their row.",
        "يمكن تعيين عضو كأدمن لهذه المجموعة من قائمة إجراء في صف الموظف.",
      ),
      groupsList: _m("Groups list", "قائمة المجموعات"),
      configureChat: _m("Configure chat permissions", "ضبط صلاحيات المحادثة"),
      makeAdmin: _m("Set as admin", "تعيين كأدمن"),
      makeMember: _m("Set as member", "تعيين كعضو"),
      addMembers: _m("Add members", "إضافة أعضاء"),
      empty: _m("No members in this group yet", "لا يوجد أعضاء في هذه المجموعة بعد"),
    }),

    sendSettings: new MessagesGroup({
      title: _m("Chat permissions of {group}", "صلاحيات محادثة {group}"),
      save: _m("Save permissions", "حفظ الصلاحيات"),
      whoCanSend: _m("Who can send?", "من يمكنه الإرسال؟"),
      whoCanSendHint: _m(
        "Choose the sending mode for the group.",
        "اختر وضع الإرسال للمجموعة.",
      ),
      adminsOnlyHint: _m(
        "Other members open the chat in read-only mode.",
        "باقي الأعضاء يفتحوا المحادثة للقراءة فقط.",
      ),
      allMembersHint: _m(
        "Any member added to the group can send.",
        "أي عضو مضاف للمجموعة يقدر يرسل.",
      ),
      specificMembersHint: _m(
        "Group admins and the selected employees can send.",
        "أدمنز المجموعة والموظفون المختارون يقدروا يرسلوا.",
      ),
      editSelection: _m("Edit selection", "تعديل الاختيار"),
      allowedMedia: _m("Allowed media", "الوسائط المسموحة"),
      allowedMediaHint: _m(
        "Applies to everyone allowed to send.",
        "تنطبق على الأشخاص المسموح لهم بالإرسال.",
      ),
      images: _m("Images", "الصور"),
      imagesHint: _m(
        "Send images from the employee device.",
        "إرسال صور من جهاز الموظف.",
      ),
      voice: _m("Voice notes", "التسجيلات الصوتية"),
      voiceHint: _m(
        "Record voice messages and send them.",
        "تسجيل الرسائل الصوتية وإرسالها.",
      ),
      files: _m("Files and attachments", "الملفات والمرفقات"),
      filesHint: _m(
        "Send files and documents from the device.",
        "إرسال ملفات ومستندات من الجهاز.",
      ),
      readHint: _m(
        "Members can always see the media published in their group.",
        "الأعضاء يقدروا يشوفوا الوسائط المنشورة في مجموعتهم.",
      ),
      mobilePreview: _m("Mobile states preview", "معاينة حالات الموبايل"),
      previewReadOnly: _m("Read only", "القراءة فقط"),
      previewText: _m("Text sending", "الإرسال النصي"),
      previewMedia: _m("Sending with media", "الإرسال والوسائط"),
      summarySeparator: _m(" · ", " · "),
    }),

    admins: new MessagesGroup({
      title: _m("Forum admins", "أدمنز المنتدى"),
      breadcrumb: _m(
        "People authorised to manage it",
        "الأشخاص المصرح لهم بالإدارة",
      ),
      assignTitle: _m("Assign a new admin", "تعيين أدمن جديد"),
      assignHint: _m(
        "Choose an employee from the forum members.",
        "اختر موظفًا من أعضاء المنتدى.",
      ),
      roleScope: _m("Role scope", "نطاق الدور"),
      transfer: _m("Transfer management", "نقل الإدارة"),
      assign: _m("Assign admin", "تعيين أدمن"),
      roleTitle: _m("Role permissions", "صلاحيات الدور"),
      roleHint: _m(
        "The role scope inside this forum and the groups under it.",
        "نطاق الدور داخل هذا المنتدى والمجموعات التابعة له.",
      ),
      manageGroups: _m(
        "Manage groups and members",
        "إدارة المجموعات والأعضاء",
      ),
      manageGroupsHint: _m(
        "Create groups, assign their admins, and manage membership",
        "إنشاء المجموعات وتعيين أدمنها وإدارة عضويتها",
      ),
      supervision: _m("Supervision and review", "الإشراف والمراجعة"),
      supervisionHint: _m(
        "Review reports and act on content",
        "مراجعة البلاغات واتخاذ الإجراءات على المحتوى",
      ),
      empty: _m("No admins assigned yet", "لا يوجد أدمنز معيّنون بعد"),
      removeAdmin: _m("Remove from admins", "إزالة من الأدمنز"),
      publishAnnouncements: _m("Publish announcements", "نشر الإعلانات"),
      toggleManageGroups: _m(
        "Toggle group management",
        "تبديل إدارة المجموعات",
      ),
      togglePublish: _m(
        "Toggle announcement publishing",
        "تبديل نشر الإعلانات",
      ),
      roleScopeNote: _m(
        "The role scope is applied through these two permissions in the API.",
        "نطاق الدور يُطبّق من خلال هاتين الصلاحيتين في الـ API.",
      ),
      removeConfirm: _m(
        "The employee stays a forum member but loses management permissions.",
        "يظل الموظف عضوًا في المنتدى لكنه يفقد صلاحيات الإدارة.",
      ),
    }),

    members: new MessagesGroup({
      groupFilter: _m("Group", "المجموعة"),
      addTitle: _m("Add employees", "إضافة موظفين"),
      addHint: _m(
        "Choose employees from the company directory to add to the forum.",
        "اختر موظفين من دليل الشركة لإضافتهم للمنتدى.",
      ),
      directorySearch: _m("Search the company directory", "البحث في دليل الشركة"),
      directoryPlaceholder: _m(
        "e.g. employee name or number",
        "مثال: اسم الموظف أو الرقم الوظيفي",
      ),
      showGroups: _m("Show groups", "عرض المجموعات"),
      addMembers: _m("Add members", "إضافة أعضاء"),
      distributeTitle: _m(
        "Distribute employees across groups",
        "توزيع الموظفين على المجموعات",
      ),
      distributeHint: _m(
        "Pick employees from the table and choose one group or more.",
        "حدّد الموظفين من الجدول واختر مجموعة أو أكثر.",
      ),
      removeFromForum: _m("Remove from forum", "إزالة من المنتدى"),
      distributionHintAfterAdd: _m(
        "New members are added without groups; distribute them from the card above.",
        "الأعضاء الجدد يُضافون بدون مجموعات، وزّعهم من الكارت بالأعلى.",
      ),
      saveDistribution: _m("Save distribution", "حفظ التوزيع"),
      removeConfirm: _m(
        "Removing a member removes them from every group in this forum.",
        "إزالة العضو تحذفه من كل مجموعات هذا المنتدى.",
      ),
      empty: _m("No members in this forum yet", "لا يوجد أعضاء في هذا المنتدى بعد"),
      groupsCountOne: _m("1 group", "مجموعة واحدة"),
      groupsCountMany: _m("{count} groups", "{count} مجموعات"),
      noGroups: _m("No groups", "بدون مجموعات"),
      distributionNote: _m(
        "Added employees join the forum, then you distribute them across groups.",
        "الموظفون المضافون ينضمون للمنتدى، ثم توزّعهم على المجموعات.",
      ),
    }),

    settings: new MessagesGroup({
      title: _m("Forum settings", "إعدادات المنتدى"),
      breadcrumb: _m("Visibility and forum status", "الظهور وحالة المنتدى"),
      save: _m("Save settings", "حفظ الإعدادات"),
      dataTitle: _m("Forum data", "بيانات المنتدى"),
      dataHint: _m(
        "The name and description shown to employees.",
        "الاسم والوصف الظاهران للموظفين.",
      ),
      name: _m("Forum name", "اسم المنتدى"),
      description: _m("Description", "الوصف"),
      visibilityTitle: _m("Visibility scope", "نطاق الظهور"),
      visibilityHint: _m(
        "Controls the forum visibility in the employee app.",
        "يتحكم في ظهور المنتدى بتطبيق الموظفين.",
      ),
      companyHint: _m(
        "The forum is visible to every employee of {company}.",
        "المنتدى ظاهر لجميع موظفي {company}.",
      ),
      scopedHint: _m(
        "Choose the managements and projects allowed to see the forum.",
        "اختر الإدارات والمشاريع المصرح لها بعرض المنتدى.",
      ),
      scopeField: _m("Managements and projects", "الإدارات والمشاريع"),
      scopePlaceholder: _m(
        "Choose the scope when limited visibility is on",
        "اختر النطاق عند تفعيل الظهور المحدد",
      ),
      archiveTitle: _m("Archive the current forum", "أرشفة المنتدى الحالي"),
      archiveHint: _m(
        "It stops showing in the employee app and stays recoverable.",
        "يتوقف ظهوره في تطبيق الموظفين ويظل محفوظًا لإمكانية الاستعادة.",
      ),
      archive: _m("Archive forum", "أرشفة المنتدى"),
      restore: _m("Restore forum", "استعادة المنتدى"),
      archivedSince: _m("Archived since {date}", "مؤرشف منذ {date}"),
    }),

    activity: new MessagesGroup({
      title: _m("Activity log", "سجل النشاط"),
      breadcrumb: _m(
        "Track decisions and changes",
        "تتبع القرارات والتغييرات",
      ),
      actionFilter: _m("Action", "الإجراء"),
      actorFilter: _m("Responsible employee", "الموظف المسؤول"),
      periodFilter: _m("Period", "الفترة"),
      periodPlaceholder: _m("Last 30 days", "آخر ٣٠ يومًا"),
      detailsAction: _m("Details", "تفاصيل"),
      filters: new MessagesGroup({
        action: _m("Action", "الإجراء"),
        allActions: _m("All actions", "كل الإجراءات"),
        actor: _m("Responsible employee", "الموظف المسؤول"),
        actorPlaceholder: _m("Employee name", "اسم الموظف"),
        from: _m("Period from", "الفترة من"),
        to: _m("Period to", "الفترة إلى"),
      }),
      columns: new MessagesGroup({
        action: _m("Action", "الإجراء"),
        actor: _m("Responsible employee", "الموظف المسؤول"),
        target: _m("Affected item", "العنصر المتأثر"),
        createdAt: _m("Date and time", "التاريخ والوقت"),
        details: _m("Details", "التفاصيل"),
      }),
      before: _m("Before the change", "قبل التعديل"),
      after: _m("After the change", "بعد التعديل"),
      empty: _m("No activity recorded yet", "لا يوجد نشاط مسجّل بعد"),
      /**
       * Keys mirror the API action values with `.` replaced by `_`, because
       * next-intl uses `.` for nesting. See `activityActionLabel`.
       */
      actions: new MessagesGroup({
        forum_published: _m("Publish forum", "نشر المنتدى"),
        forum_updated: _m("Edit forum settings", "تعديل إعدادات المنتدى"),
        forum_archived: _m("Archive forum", "أرشفة المنتدى"),
        forum_restored: _m("Restore forum", "استعادة المنتدى"),
        forum_admins_updated: _m("Edit forum admins", "تعديل أدمنز المنتدى"),
        forum_members_updated: _m(
          "Edit forum members",
          "تعديل أعضاء المنتدى",
        ),
        group_created: _m("Create group", "إنشاء مجموعة"),
        group_updated: _m("Edit group", "تعديل مجموعة"),
        group_archived: _m("Archive group", "أرشفة مجموعة"),
        group_members_updated: _m(
          "Edit group members",
          "تعديل أعضاء مجموعة",
        ),
        group_send_settings_updated: _m(
          "Change sending permission",
          "تغيير صلاحية الإرسال",
        ),
        announcement_published: _m("Publish announcement", "نشر إعلان"),
        announcement_deleted: _m("Delete announcement", "حذف إعلان"),
        report_resolved: _m("Resolve report", "معالجة بلاغ"),
      }),
      fields: new MessagesGroup({
        send_permission: _m("Sending mode", "وضع الإرسال"),
        allowed_user_ids: _m("Allowed to send", "المسموح لهم"),
        allow_images: _m("Images", "الصور"),
        allow_voice: _m("Voice notes", "التسجيلات الصوتية"),
        allow_files: _m("Files", "الملفات"),
        name: _m("Name", "الاسم"),
        description: _m("Description", "الوصف"),
        visibility: _m("Visibility scope", "نطاق الظهور"),
        status: _m("Status", "الحالة"),
        members: _m("Members", "الأعضاء"),
        admins: _m("Admins", "الأدمنز"),
      }),
    }),
  }),

  announcements: new MessagesGroup({
    title: _m("Announcements", "الإعلانات العامة"),
    subtitle: _m(
      "The company's unified channel for every employee",
      "قناة الشركة الموحدة لكل الموظفين",
    ),
    create: _m("New announcement", "إعلان جديد"),
    searchPlaceholder: _m("Search by announcement title", "ابحث بعنوان الإعلان"),
    statusFilter: _m("Announcement status", "حالة الإعلان"),
    publisherFilter: _m("Publisher", "الناشر"),
    stats: new MessagesGroup({
      total: _m("Total announcements", "إجمالي الإعلانات"),
      totalHint: _m("Company wide", "على مستوى الشركة"),
      published: _m("Published", "منشورة"),
      publishedHint: _m("Visible to all employees", "تظهر لكل الموظفين"),
      drafts: _m("Drafts", "مسودات"),
      draftsHint: _m("Waiting to be published", "في انتظار النشر"),
      archived: _m("Archived", "مؤرشفة"),
      archivedHint: _m("Kept in the log", "محفوظة في السجل"),
    }),
    columns: new MessagesGroup({
      title: _m("Title", "العنوان"),
      author: _m("Publisher / owner", "الناشر / المسؤول"),
      scope: _m("Scope", "النطاق"),
      status: _m("Status", "الحالة"),
      date: _m("Date", "التاريخ"),
    }),
    statusValues: new MessagesGroup({
      draft: _m("Draft", "مسودة"),
      published: _m("Published", "منشور"),
      archived: _m("Archived", "مؤرشف"),
    }),
    allEmployees: _m("All company employees", "كل موظفي الشركة"),
    empty: _m("No announcements yet", "لا توجد إعلانات بعد"),
    deleteConfirmTitle: _m("Delete this announcement?", "حذف هذا الإعلان؟"),
    deleteConfirmBody: _m(
      "It is removed for every employee who can see it.",
      "سيُحذف لكل موظف يظهر له.",
    ),

    form: new MessagesGroup({
      pageTitle: _m("Create a public announcement", "إنشاء إعلان عام"),
      pageSubtitle: _m(
        "The announcement shows in the public announcements channel for every company employee",
        "يظهر الإعلان في قناة الإعلانات العامة لكل موظفي الشركة",
      ),
      contentTitle: _m("Announcement content", "محتوى الإعلان"),
      audience: _m(
        "Audience: all company employees",
        "الجمهور: كل موظفي الشركة",
      ),
      title: _m("Announcement title", "عنوان الإعلان"),
      body: _m("Announcement body", "نص الإعلان"),
      addImage: _m("Add image", "إضافة صورة"),
      addFile: _m("Attach file", "إرفاق ملف"),
      addVoice: _m("Voice note", "تسجيل صوتي"),
      notify: _m("Notify employees", "إشعار الموظفين"),
      notifyHint: _m(
        "Send a notification when the announcement is published.",
        "إرسال إشعار عند نشر الإعلان.",
      ),
      previewTitle: _m("How the employee sees it", "كيف سيظهر للموظف"),
      previewBadge: _m("Preview", "معاينة"),
      previewFooter: _m(
        "An example view in the employee app",
        "عرض مثال في تطبيق الموظفين",
      ),
      previewAuthor: _m("General management", "الإدارة العامة"),
      previewEmptyTitle: _m("Announcement title", "عنوان الإعلان"),
      previewEmptyBody: _m(
        "The announcement body shows here.",
        "يظهر نص الإعلان هنا.",
      ),
      cancel: _m("Cancel announcement", "إلغاء الإعلان"),
      publish: _m("Publish announcement", "نشر الإعلان"),
      imageTooLarge: _m(
        "The image must be 10MB or less",
        "الصورة يجب أن تكون ١٠ ميجابايت أو أقل",
      ),
      fileTooLarge: _m(
        "The file must be 20MB or less",
        "الملف يجب أن يكون ٢٠ ميجابايت أو أقل",
      ),
      voiceTooLarge: _m(
        "The voice note must be 20MB or less",
        "التسجيل الصوتي يجب أن يكون ٢٠ ميجابايت أو أقل",
      ),
      voiceWrongType: _m(
        "Allowed audio formats: m4a, aac, mp3, ogg, wav, webm",
        "صيغ الصوت المسموحة: m4a, aac, mp3, ogg, wav, webm",
      ),
      removeAttachment: _m("Remove attachment", "إزالة المرفق"),
      published: _m("Announcement published", "تم نشر الإعلان"),
    }),
  }),

  reports: new MessagesGroup({
    title: _m("Forum reports", "بلاغات المنتديات"),
    subtitle: _m(
      "Review the reports coming from employee chats",
      "مراجعة البلاغات الواردة من محادثات الموظفين",
    ),
    searchPlaceholder: _m("Search by report title", "ابحث بعنوان البلاغ"),
    forumFilter: _m("Forum", "المنتدى"),
    groupFilter: _m("Group", "المجموعة"),
    pickForum: _m(
      "Choose a forum to review its reports",
      "اختر منتدى لمراجعة بلاغاته",
    ),
    stats: new MessagesGroup({
      new: _m("New reports", "بلاغات جديدة"),
      newHint: _m("Awaiting review", "بانتظار المراجعة"),
      inReview: _m("In review", "قيد المراجعة"),
      inReviewHint: _m("Being processed", "قيد المعالجة"),
      closed: _m("Closed", "مغلقة"),
      closedHint: _m("Kept in the log", "محفوظة في السجل"),
      resolved: _m("Resolved", "تمت المعالجة"),
      resolvedHint: _m("Action recorded", "تم تسجيل الإجراء"),
    }),
    columns: new MessagesGroup({
      report: _m("Report", "البلاغ"),
      reporter: _m("Reporter", "المبلِّغ"),
      group: _m("Group", "المجموعة"),
    }),
    statusValues: new MessagesGroup({
      new: _m("New", "جديد"),
      in_review: _m("In review", "قيد المراجعة"),
      resolved: _m("Resolved", "تمت المعالجة"),
      closed: _m("Closed", "مغلق"),
    }),
    review: _m("Review", "مراجعة"),
    empty: _m("No reports in this forum", "لا توجد بلاغات في هذا المنتدى"),

    modal: new MessagesGroup({
      title: _m("Review the report", "مراجعة البلاغ"),
      subtitle: _m("Report #{id} · {forum}", "البلاغ #{id} · {forum}"),
      dataTitle: _m("Report data", "بيانات البلاغ"),
      group: _m("Group", "المجموعة"),
      reporter: _m("Reporter", "المبلِّغ"),
      sender: _m("Sender", "المرسل"),
      reportDate: _m("Report date", "تاريخ البلاغ"),
      status: _m("Status", "الحالة"),
      messageTitle: _m("The reported message", "الرسالة المبلَّغ عنها"),
      decisionTitle: _m("Review decision", "قرار المراجعة"),
      decisionHint: _m(
        "The action and its reason are recorded in the activity log.",
        "سجل الإجراء وسببه في سجل النشاط.",
      ),
      deleteMessage: _m(
        "Hide the message and its attachment",
        "إخفاء الرسالة والمرفق",
      ),
      deleteMessageHint: _m(
        "The content disappears from the chat for employees.",
        "يختفي المحتوى من المحادثة للموظفين.",
      ),
      keepMessage: _m(
        "Close the report and keep the content",
        "إغلاق البلاغ مع إبقاء المحتوى",
      ),
      keepMessageHint: _m(
        "The review outcome is saved in the activity log.",
        "لحفظ نتيجة المراجعة في سجل النشاط.",
      ),
      note: _m("Action reason", "سبب الإجراء"),
      notePlaceholder: _m(
        "Write the reason behind this decision",
        "اكتب سبب هذا القرار",
      ),
      noteRequired: _m("The action reason is required", "سبب الإجراء مطلوب"),
      back: _m("Back to reports", "رجوع للبلاغات"),
      submit: _m("Approve the decision", "اعتماد القرار"),
    }),
  }),

  /** Copy for design fields the forum API does not accept yet. */
  pendingBackend: _m(
    "This field is not supported by the API yet",
    "هذا الحقل غير مدعوم من الـ API بعد",
  ),
});
