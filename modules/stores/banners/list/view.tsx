"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import MainBannerView from "./views/main-banner";
import DiscountBannerView from "./views/discount-banner";

function BannersView() {
  return (
    <div className="space-y-1">
      <TabsGroup
        tabs={[
          {
            label: "الرئيسية",
            value: "main",
            component: <MainBannerView />,
          },
          {
            label: "الخصومات",
            value: "discounts",
            component: <DiscountBannerView />,
          },
        ]}
        defaultValue="main"
        variant="primary"
      />
    </div>
  );
}

export default BannersView;
