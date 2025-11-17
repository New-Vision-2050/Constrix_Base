import { _m, MessagesGroup } from "../../types";

export const docsLibraryMessages = new MessagesGroup({
  title: _m("Docs Library", "مكتبة المستندات"),
  cards: new MessagesGroup({
    noData: _m("No data to display", "لا توجد بيانات للعرض")
  }),
  statistics: new MessagesGroup({
    documentStats: new MessagesGroup({
      title: _m("Number of company documents", "عدد المستندات الشركة"),
      mainLabel: _m("Document", "مستند"),
      comparison: new MessagesGroup({
        leftLabel: _m("Remaining Space", "المساحة المتبقية"),
        rightLabel: _m("Used Space", "المساحة المستهلكة")
      })
    }),
    activityStats: new MessagesGroup({
      title: _m("Active Documents", "المستندات السارية"),
      description: _m("Average active documents for the company", "معدل المستندات السارية للشركة"),
      title2: _m("Expired Documents", "المستندات المنتهية"),
      description2: _m("Average expired documents for the company", "معدل المستندات المنتهية للشركة")
    }),
    expirationStats: new MessagesGroup({
      title: _m("Documents nearing expiration", "المستندات المقتربة على الانتهاء"),
      countLabel: _m("Number of document downloads", "عدد تحميلات المستند"),
      badgeText: _m("expiring soon", "تنتهي قريباً")
    })
  }),
  tabsTitles: new MessagesGroup({
    publicDocs: _m("Public Docs", "المستندات العامة"),
    empsDocs: _m("Employee Docs", "المستندات الموظفين"),
    privateDocs: _m("Private Docs", "المستندات الخاصة"),
    inboxDocs: _m("Inbox Docs", "المستندات الواردة")
  }),
  searchFields: new MessagesGroup({
    search: _m("Search Filters", "فلتر البحث"),
    documentType: _m("Document Type", "نوع المستند"),
    type: _m("Type", "النوع"),
    endDate: _m("End Date", "تاريخ النهاية")
  }),
  shareDialog: new MessagesGroup({
    title: _m("Share", ""),
    save: _m("Save", ""),
    copy: _m("Copy Link", ""),
    cancel: _m("Cancel", ""),
    selectFolder: _m("Select Folder", ""),
    searchFolder: _m("Search", ""),
    noResults: _m("No Results", ""),
    searchUsers: _m("Search Users", ""),
    notes: _m("Please enter the email address of the user you want to share the files with", "")
  }),
  publicDocs: new MessagesGroup({
    allBranches: _m("All Branches", "جميع الفروع"),
    header: new MessagesGroup({
      search: _m("Search", "بحث"),
      add: _m("Add", "إضافة"),
      file: _m("File", "ملف"),
      dir: _m("Dir", "مجلد"),
      export: _m("Export", "تصدير"),
      sort: _m("Sort", "ترتيب"),
      grid: _m("Grid", "شبكة"),
      list: _m("List", "قائمة"),
      details: _m("Details", "تفاصيل"),
      share: _m("Share", "مشاركة"),
      copy: _m("Copy", "نسخ"),
      requestFile: _m("Request File", "طلب ملف"),
      delete: _m("Delete", "حذف"),
      download: _m("Download", "تحميل"),
      favorite: _m("Favorite", "المفضلة"),
      move: _m("Move", "نقل"),
      deleteDir: _m("Are you sure you want to delete this directory?", "هل انت متاكد من حذف المجلد؟"),
      deleteFile: _m("Are you sure you want to delete this file?", "هل انت متاكد من حذف الملف؟"),
      deleteSuccess: _m("Delete Operation done successfully", "عملية الحذف تمت بنجاح"),
      deleteFailed: _m("Delete Operation failed", "فشلت عملية الحذف")
    }),
    ActivityLogs: new MessagesGroup({
      title: _m("Activity Logs", "سجل النشاط"),
      loading: _m("Loading activity logs...", "جاري تحميل سجل الأنشطة..."),
      noActivities: _m("No activities found", "لا توجد أنشطة")
    }),
    table: new MessagesGroup({
      doc_name: _m("Folder/File Name", "اسم المستند/المجلد"),
      sortedBy: _m("Sorted By", "تم التعديل بواسطة"),
      fileSize: _m("File Size", "حجم الملف"),
      docsCount: _m("Docs Count", "عدد المستندات"),
      fileType: _m("File Type", "سمة الملف"),
      lastActivity: _m("Last Activity", "اخر نشاط"),
      status: _m("Status", "الحالة"),
      settings: _m("Settings", "الاعدادات"),
      active: _m("Active", "نشط"),
      inactive: _m("Inactive", "غير نشط"),
      statusChanged: _m("Status changed successfully", "تم تغيير الحالة بنجاح"),
      statusChangeFailed: _m("Failed to change status", "فشل تغيير الحالة"),
      actions: new MessagesGroup({
        title: _m("Action", "أجراء"),
        view: _m("Details", "تفاصيل"),
        hide: _m("Hide", "أخفاء"),
        delete: _m("Delete", "حذف"),
        download: _m("Download", "تحميل"),
        favorite: _m("Favorite", "المفضلة"),
        move: _m("Move", "نقل"),
        share: _m("Share", "مشاركة"),
        edit: _m("Edit", "تعديل"),
        deleteDir: _m("Are you sure you want to delete this directory?", "هل انت متاكد من حذف المجلد؟"),
        deleteFile: _m("Are you sure you want to delete this file?", "هل انت متاكد من حذف الملف؟"),
        deleteSuccess: _m("Delete Operation done successfully", "عملية الحذف تمت بنجاح"),
        deleteFailed: _m("Delete Operation failed", "فشلت عملية الحذف")
      })
    }),
    directoryPasswordDialog: new MessagesGroup({
      title: _m("Directory Password", "كلمة المرور"),
      description: _m("This directory is protected by a password. Please enter the password to access it.", "هذا المجلد محمي بكلمة المرور. يرجى إدخال كلمة المرور للاستفادة منه."),
      passwordLabel: _m("Password", "كلمة المرور"),
      passwordPlaceholder: _m("Enter password", "أدخل كلمة المرور"),
      confirm: _m("Confirm", "تأكيد"),
      cancel: _m("Cancel", "إلغاء")
    }),
    copyMoveDialog: new MessagesGroup({
      copyTitle: _m("Copy", "نسخ الى"),
      moveTitle: _m("Move", "نقل الى"),
      save: _m("Save", "حفظ"),
      cancel: _m("Cancel", "الغاء"),
      label: _m("To Directory", "الى مجلد"),
      selectFolder: _m("Select Folder", "اختر مجلد"),
      searchFolder: _m("Search", "بحث"),
      noResults: _m("No Results", "لا توجد نتائج"),
      loadingFolders: _m("Loading folders...", "جاري تحميل المجلدات..."),
      errorLoadingFolders: _m("Error loading folders", "حدث خطأ في تحميل المجلدات"),
      copying: _m("Copying...", "جاري النسخ..."),
      moving: _m("Moving...", "جاري النقل..."),
      copySuccess: _m("File copied successfully", "تم نسخ الملف بنجاح"),
      moveSuccess: _m("File moved successfully", "تم نقل الملف بنجاح"),
      moveCopeError: _m("Error during operation", "حدث خطأ أثناء العملية")
    }),
    shareDialog: new MessagesGroup({
      title: _m("Share", "مشاركة"),
      save: _m("Save", "حفظ"),
      sharedSuccessfully: _m("File shared successfully", "تم مشاركة الملف بنجاح"),
      linkCopiedSuccessfully: _m("Link copied successfully", "تم نسخ الرابط بنجاح"),
      linkCopiedFailed: _m("Failed to copy link", "فشل نسخ الرابط"),
      noFilesSelected: _m("No files selected", "لا توجد ملفات محددة"),
      sharedFailed: _m("Failed to share file", "فشل مشاركة الملف"),
      copy: _m("Copy Link", "نسخ الرابط"),
      cancel: _m("Cancel", "الغاء"),
      selectFolder: _m("Select Folder", "اختر مجلد"),
      searchFolder: _m("Search", "بحث"),
      noResults: _m("No Results", "لا توجد نتائج"),
      searchUsers: _m("Search Users", "بحث المستخدمين"),
      notes: _m("Please enter the email address of the user you want to share the files with", "الرجاء كتابة البريد الالكتروني الذي تود مشاركة الملفات معه")
    }),
    createNewDirDialog: new MessagesGroup({
      title: _m("Create New Directory", "إنشاء مجلد جديد"),
      editTitle: _m("Edit Directory", "تعديل مجلد"),
      name: _m("Name", "اسم المجلد"),
      namePlaceholder: _m("Enter name", "ادخل اسم المجلد"),
      password: _m("Password", "كلمة المرور"),
      passwordPlaceholder: _m("Enter password", "ادخل كلمة المرور"),
      permission: _m("Permission", "الصلاحية"),
      public: _m("Public", "عامة"),
      private: _m("Private", "خاصة"),
      createdAt: _m("Created At", ""),
      createdAtPlaceholder: _m("Enter Created At", ""),
      endDate: _m("End Date", ""),
      endDatePlaceholder: _m("Enter End Date", ""),
      users: _m("Users", "المستخدمين"),
      usersPlaceholder: _m("Select users", "اختر المستخدمين"),
      file: _m("Attach logo or icon", "ارفاق شعار او ايقونة"),
      submitButtonText: _m("Save", "حفظ"),
      cancelButtonText: _m("Cancel", "الغاء"),
      resetButtonText: _m("Reset", "مسح")
    }),
    createNewFileDialog: new MessagesGroup({
      title: _m("Create New File", "إنشاء ملف جديد"),
      name: _m("Name", "اسم الملف"),
      namePlaceholder: _m("Enter name", "ادخل اسم الملف"),
      reference_number: _m("Reference Number", "رقم المرجع"),
      reference_numberPlaceholder: _m("Enter Reference Number", "ادخل رقم المرجع"),
      password: _m("Password", "كلمة المرور"),
      passwordPlaceholder: _m("Enter password", "ادخل كلمة المرور"),
      permission: _m("Permission", "الصلاحية"),
      createdAt: _m("Created At", "تاريخ الانشاء"),
      createdAtPlaceholder: _m("Enter Created At", "ادخل تاريخ الانشاء"),
      endDate: _m("End Date", "تاريخ الانتهاء"),
      endDatePlaceholder: _m("Enter End Date", "ادخل تاريخ الانتهاء"),
      public: _m("Public", "عامة"),
      private: _m("Private", "خاصة"),
      users: _m("Users", "المستخدمين"),
      usersPlaceholder: _m("Select users", "اختر المستخدمين"),
      file: _m("Attach logo or icon", "ارفاق شعار او ايقونة"),
      submitButtonText: _m("Save", "حفظ"),
      cancelButtonText: _m("Cancel", "الغاء"),
      resetButtonText: _m("Reset", "مسح")
    })
  })
});
