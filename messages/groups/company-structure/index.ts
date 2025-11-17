import { _m, MessagesGroup } from "../../types";

export const companyStructureMessages = new MessagesGroup({
  actions: new MessagesGroup({
    viewMode: _m("View Mode", "عرض"),
    print: _m("Print", "طباعة"),
    exportPdf: _m("Export PDF", "تصدير PDF"),
    setAsParent: _m("Set as Parent", "تعيين كأب"),
    treeView: _m("Tree View", "عرض شجري"),
    listView: _m("List View", "عرض قائمة")
  }),
  cards: new MessagesGroup({
    users: new MessagesGroup({
      title: _m("Number of Employees Indicator", "مؤشر عدد الموظفين"),
      subtitle: _m("Total Number of Employees", "اجمالي عدد الموظفين"),
      reminderStatement: _m("Number of Employees Remaining", "عدد الموظفين المتبقية"),
      achievedStatement: _m("Number of Employees Used", "عدد الموظفين المستخدمة")
    }),
    departments: new MessagesGroup({
      title: _m("Number of Sub-Departments Indicator", "مؤشر عدد الأقسام الفرعية"),
      subtitle: _m("Total Number of Sub-Departments", "اجمالي عدد الأقسام الفرعية"),
      reminderStatement: _m("Number of Sub-Departments Remaining", "عدد الأقسام الفرعية المتبقية"),
      achievedStatement: _m("Number of Sub-Departments Used", "عدد الأقسام الفرعية المستخدمة")
    }),
    managements: new MessagesGroup({
      title: _m("Number of Main Departments Indicator", "مؤشر عدد الادارات الرئيسية"),
      subtitle: _m("Total Number of Main Departments", "اجمالي عدد الادارات الرئيسية"),
      reminderStatement: _m("Number of Main Departments Remaining", "عدد الادارات الرئيسية المتبقية"),
      achievedStatement: _m("Number of Main Departments Used", "عدد الادارات الرئيسية المستخدمة")
    }),
    branches: new MessagesGroup({
      title: _m("Number of Branches Indicator", "مؤشر عدد الفروع"),
      subtitle: _m("Total Number of Branches", "اجمالي عدد الفروع"),
      reminderStatement: _m("Number of branches remaining", "عدد الفروع المتبقية"),
      achievedStatement: _m("Number of branches used", "عدد الفروع المستخدمة")
    })
  }),
  tabs: new MessagesGroup({
    mainTabs: new MessagesGroup({
      "organizational-structure-main-tab-1": new MessagesGroup({
        title: _m("Organizational Structure", "الهيكل التنظيمي"),
        tabs: new MessagesGroup({
          companyStructure: new MessagesGroup({
            title: _m("Company Structure", "بنية الشركة")
          }),
          usersStructure: new MessagesGroup({
            title: _m("Employee Structure", "هيكل الموظفين")
          }),
          managements: new MessagesGroup({
            title: _m("Departments", "الادارات")
          })
        })
      }),
      "organizational-structure-main-tab-2": new MessagesGroup({
        title: _m("Structure Settings", "أعدادات الهيكل"),
        tabs: new MessagesGroup({
          jobTitles: new MessagesGroup({
            title: _m("Job Titles", "المسميات الوظيفية")
          }),
          jobTypes: new MessagesGroup({
            title: _m("Job Types", "أنواع الوظائف")
          }),
          managements: new MessagesGroup({

          }),
          departments: new MessagesGroup({
            title: _m("Departments", "اعدادات الاقسام")
          })
        })
      })
    })
  }),
  CompanyOrganizationalStructure: new MessagesGroup({
    loading: _m("Loading organizational structure data...", "تحميل بيانات الهيكل التنظيمي...")
  }),
  ManagementStructure: new MessagesGroup({
    loading: _m("Loading Managements data...", "تحميل بيانات الإدارات..."),
    confirmDelete: _m("Are you sure you want to delete this management?", "هل انت متأكد من حذف هذه الإدارة؟")
  })
});
