import { _m, MessagesGroup } from "../../types";
import { servicesSettingsMessages } from "./services-settings";
import { termsMessages } from "./terms";
import { proceduresSettingsMessages } from "./procedures-settings";

export const crmsettingsModuleMessages = new MessagesGroup({
  tabs: new MessagesGroup({
    clientsSettings: _m("Clients Settings", "إعدادات العملاء"),
    clientsPermissions: _m("Clients Permissions", "صلاحيات العملاء"),
    terms: _m("Terms", "البنود"),
    servicesSettings: _m("Services Settings", "إعدادات الخدمات"),
    proceduresSettings: _m("Procedures Settings", "اعدادات الإجراءات"),
  }),
  ClientsSettings: new MessagesGroup({
    shareClientsData: _m(
      "Share clients data between branches",
      "مشاركة بيانات العملاء بين الفروع",
    ),
    shareBrokersData: _m(
      "Share brokers data between branches",
      "مشاركة بيانات الوسطاء بين الفروع",
    ),
  }),
  terms: termsMessages,
  servicesSettings: servicesSettingsMessages,
  proceduresSettings: proceduresSettingsMessages,
});
