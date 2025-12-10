import { _m, MessagesGroup } from "../../types";

export const clientProfileModuleMessages = new MessagesGroup({
  common: new MessagesGroup({}),
  header: new MessagesGroup({
    userTypes: new MessagesGroup({
      client: _m("Client", "عميل"),
      broker: _m("Broker", "وسيط"),
      employee: _m("Employee", "موظف"),
    }),
  }),
  sections: new MessagesGroup({
    financialReport: new MessagesGroup({
      title: _m("Financial Report", "بيان مالي"),
      emptyDescription: _m("No data available", "لا يوجد بيانات"),
    }),
    invoices: new MessagesGroup({
      title: _m("Invoices", "الفواتير"),
      emptyDescription: _m("No data available", "لا يوجد بيانات"),
    }),
    activityLog: new MessagesGroup({
      title: _m("Activity Log", "سجل الانشطة"),
      emptyDescription: _m("You don't have any activities yet", "ليس لديك اي انشطة بعد"),
    }),
    upcomingMeetings: new MessagesGroup({
      title: _m("Upcoming Meetings", "الاجتماعات القادمة"),
      emptyDescription: _m("You don't have any upcoming meetings yet", "ليس لديك اي اجتماعات قادمة بعد"),
      requestMeetingBtn: _m("Request Meeting", "طلب اجتماع"),
    }),
    projects: new MessagesGroup({
      title: _m("Projects", "المشاريع"),
      emptyDescription: _m("You don't have any projects yet", "ليس لديك اي مشاريع بعد"),
    }),
    requests: new MessagesGroup({
      title: _m("Requests", "الطلبات"),
      emptyDescription: _m("You don't have any requests yet", "ليس لديك اي طلبات بعد"),
    }),
    priceOffers: new MessagesGroup({
      title: _m("Price Offers", "عروض الأسعار"),
      emptyDescription: _m("You don't have any price offers yet", "ليس لديك اي عروض اسعار بعد"),
    }),
    contracts: new MessagesGroup({
      title: _m("Contracts", "العقود"),
      emptyDescription: _m("You don't have any contracts yet", "ليس لديك اي عقود بعد"),
    }),
  }),
  statistics: new MessagesGroup({
    contractsFinancialStatement: new MessagesGroup({
      title: _m("Contracts Financial Statement", "بيان مالي للعقود"),
      emptyDescription: _m("No data available", "لا يوجد بيانات"),
    }),
    projects: new MessagesGroup({
      title: _m("Projects", "المشاريع"),
      emptyDescription: _m("No data available", "لا يوجد بيانات"),
    }),
    invoices: new MessagesGroup({
      title: _m("Invoices", "الفواتير"),
      emptyDescription: _m("No data available", "لا يوجد بيانات"),
    }),
  }),
})