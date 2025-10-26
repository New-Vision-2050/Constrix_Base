"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import CouponView from "./views/coupon";
import OfferView from "./views/offer";
import DealOfDayView from "./views/deal-of-day";
import FeaturedDealView from "./views/featured-deal";

function CouponsView() {
  return (
    <div className="space-y-1">
      <TabsGroup
        tabs={[
          {
            label: "قسيمة",
            value: "coupon",
            component: <CouponView />,
          },
          {
            label: "عرض",
            value: "offer",
            component: <OfferView />,
          },
          {
            label: "صفقة اليوم",
            value: "deal-of-day",
            component: <DealOfDayView />,
          },
          {
            label: "صفقة مميزة",
            value: "featured-deal",
            component: <FeaturedDealView />,
          },
        ]}
        defaultValue="coupon"
        variant="primary"
      />
    </div>
  );
}

export default CouponsView;
