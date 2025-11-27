import { MessagesGroup } from "../../types";
import { ContentManagementSystemProjectsPageMessages } from "./projects";
import { ContentManagementSystemCategoriesMessages } from "./categories";
import { ContentManagementSystemIconsMessages } from "./icons";
import { ContentManagementSystemMainSettingsMessages } from "./main-settings";
import { AboutManagementSystemContactSettingMessages } from "./about-setting";
import { ContentManagementSystemTermsConditionsMessages } from "./terms-conditions";
import { ContentManagementSystemMainDataMessages } from "./main-data";
import { ContentManagementSystemFounderMessages } from "./founder";
import { ContentManagementSystemServicesMessages } from "./services";
import { ContentManagementSystemNewsMessages } from "./news";
import { ContentManagementSystemThemeSettingMessages } from "./theme-setting";

export const contentManagementSystemMessages = new MessagesGroup({
  categories: ContentManagementSystemCategoriesMessages,
  projects: ContentManagementSystemProjectsPageMessages,
  icons: ContentManagementSystemIconsMessages,
  mainSettings: ContentManagementSystemMainSettingsMessages,
  aboutSetting: AboutManagementSystemContactSettingMessages,
  termsConditions: ContentManagementSystemTermsConditionsMessages,
  mainData: ContentManagementSystemMainDataMessages,
  founder: ContentManagementSystemFounderMessages,
  services: ContentManagementSystemServicesMessages,
  news: ContentManagementSystemNewsMessages,
  themeSetting: ContentManagementSystemThemeSettingMessages,
});
