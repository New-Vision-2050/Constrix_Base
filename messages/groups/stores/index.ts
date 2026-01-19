import { MessagesGroup } from "@/messages/types";
import { mainCategoriesMessages } from "./main-categories/main-categories";
import { warehouseMessages } from "./warehouse";

export const storesMessages = new MessagesGroup({
  mainCategories: mainCategoriesMessages,
  warehouse: warehouseMessages,
});
