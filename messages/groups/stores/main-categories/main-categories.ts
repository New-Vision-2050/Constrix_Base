import { _m, MessagesGroup } from "@/messages/types";
import { mainCategoriesTableMessages } from "./table";

export const mainCategoriesMessages = new MessagesGroup({
  title: _m("Main Categories", "التصنيفات الرئيسية"),
  // Table messages
  table: mainCategoriesTableMessages,
});
