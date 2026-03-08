"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import MainPageView from "./views/main-page";
import DiscountsView from "./views/discounts";
import NewArrivalsView from "./views/new-arrivals";
import ContactView from "./views/contact";
import AboutUsView from "./views/about-us";
import { useTranslations } from "next-intl";
import { Tab } from "@/types/Tab";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

type ShowableTab = Tab & { show: boolean };

function PagesSettingView() {
  const { can } = usePermissions();
  const t = useTranslations("pagesSettings.tabs");

  const tabs: ShowableTab[] = [
    {
      label: t("home"),
      value: "home",
      component: <MainPageView />,
      show: can(PERMISSIONS.ecommerce.banner.list),
    },
    {
      label: t("discounts"),
      value: "discount",
      component: <DiscountsView />,
      show: can(PERMISSIONS.ecommerce.banner.list),
    },
    {
      label: t("newArrivals"),
      value: "new-arrival",
      component: <NewArrivalsView />,
      show: can(PERMISSIONS.ecommerce.banner.list),
    },
    {
      label: t("contact"),
      value: "contact",
      component: <ContactView />,
      show: can(PERMISSIONS.ecommerce.banner.list),
    },
    {
      label: t("aboutUs"),
      value: "about-us",
      component: <AboutUsView />,
      show: can(PERMISSIONS.ecommerce.banner.list),
    },
  ]

  return (
    <div className="space-y-1">
      <TabsGroup
        tabs={tabs.filter((tab) => tab.show)}
        defaultValue="home"
        variant="primary"
      />
    </div>
  );
}

export default PagesSettingView;
