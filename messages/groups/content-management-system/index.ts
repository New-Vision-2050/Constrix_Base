import { MessagesGroup } from "../../types";
import { ContentManagementSystemProjectsPageMessages } from "./projects";
import { ContentManagementSystemCategoriesMessages } from "./categories";
import { ContentManagementSystemIconsMessages } from "./icons";
import { ContentManagementSystemMainSettingsMessages } from "./main-settings";
import { ContentManagementSystemContactSettingMessages } from "./contact-setting";
import { ContentManagementSystemTermsConditionsMessages } from "./terms-conditions";
import { ContentManagementSystemMainDataMessages } from "./main-data";
import { ContentManagementSystemFounderMessages } from "./founder";

export const contentManagementSystemMessages = new MessagesGroup({
  categories: ContentManagementSystemCategoriesMessages,
  projects: ContentManagementSystemProjectsPageMessages,
  icons: ContentManagementSystemIconsMessages,
  mainSettings: ContentManagementSystemMainSettingsMessages,
  contactSetting: ContentManagementSystemContactSettingMessages,
  termsConditions: ContentManagementSystemTermsConditionsMessages,
  mainData: ContentManagementSystemMainDataMessages,
  founder: ContentManagementSystemFounderMessages,
});
