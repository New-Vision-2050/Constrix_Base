"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import MainPageView from "./views/main-page";
import DiscountsView from "./views/discounts";
import NewArrivalsView from "./views/new-arrivals";
import ContactView from "./views/contact";
import AboutUsView from "./views/about-us";
import { useTranslations } from "next-intl";

function PagesSettingView() {
  const t = useTranslations("pagesSettings.tabs");

  return (
    <div className="space-y-1">
      <TabsGroup
        tabs={[
          {
            label: t("home"),
            value: "home",
            component: <MainPageView />,
          },
          {
            label: t("discounts"),
            value: "discount",
            component: <DiscountsView />,
          },
          {
            label: t("newArrivals"),
            value: "new-arrival",
            component: <NewArrivalsView />,
          },
          {
            label: t("contact"),
            value: "contact",
            component: <ContactView />,
          },
          {
            label: t("aboutUs"),
            value: "about-us",
            component: <AboutUsView />,
          },
        ]}
        defaultValue="home"
        variant="primary"
      />
    </div>
  );
}

export default PagesSettingView;
