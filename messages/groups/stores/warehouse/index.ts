import { _m, MessagesGroup } from "@/messages/types";
import { warehouseTableMessages } from "./table";

export const warehouseMessages = new MessagesGroup({
  title: _m("Warehouses", "المستودعات"),
  deleteConfirmMessage: _m("Are you sure you want to delete this warehouse?", "هل أنت متأكد من حذف هذا المستودع؟"),
  // Table messages
  table: warehouseTableMessages,
});
