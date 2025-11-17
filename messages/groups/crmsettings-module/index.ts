import { _m, MessagesGroup } from "../../types";

export const crmsettingsModuleMessages = new MessagesGroup({
  tabs: new MessagesGroup({
    clientsSettings: _m("Clients Settings", "إعدادات العملاء"),
    clientsPermissions: _m("Clients Permissions", "صلاحيات العملاء")
  }),
  ClientsSettings: new MessagesGroup({
    shareClientsData: _m("Share clients data between branches", "مشاركة بيانات العملاء بين الفروع"),
    shareBrokersData: _m("Share brokers data between branches", "مشاركة بيانات الوسطاء بين الفروع")
  })
});
