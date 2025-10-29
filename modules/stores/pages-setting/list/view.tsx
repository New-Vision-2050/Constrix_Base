"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import MainPageView from "./views/main-page";
import DiscountsView from "./views/discounts";
import NewArrivalsView from "./views/new-arrivals";
import ContactView from "./views/contact";
import AboutUsView from "./views/about-us";

function PagesSettingView() {
  return (
    <div className="space-y-1">
      <TabsGroup
        tabs={[
          {
            label: "الرئيسية",
            value: "home",
            component: <MainPageView />,
          },
          {
            label: "الخصومات",
            value: "discount",
            component: <DiscountsView />,
          },
          {
            label: "الوصول جديدنا",
            value: "new-arrival",
            component: <NewArrivalsView />,
          },
          {
            label: "التواصل",
            value: "contact",
            component: <ContactView />,
          },
          {
            label: "من نحن",
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
