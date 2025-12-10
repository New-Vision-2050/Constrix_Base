"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import CouponView from "./views/coupon";
import OfferView from "./views/offer";
import DealOfDayView from "./views/deal-of-day";
import FeaturedDealView from "./views/featured-deal";
import { Tab } from "@/types/Tab";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type ShowableTab = Tab & { show: boolean };

function CouponsView() {
  const { can } = usePermissions();
  const tabs: ShowableTab[] = [
    {
      label: "قسيمة",
      value: "coupon",
      component: <CouponView />,
      show: can(PERMISSIONS.ecommerce.coupon.list),
    },
    {
      label: "عرض",
      value: "offer",
      component: <OfferView />,
      show: can(PERMISSIONS.ecommerce.flashDeal.list),
    },
    {
      label: "صفقة اليوم",
      value: "deal-of-day",
      component: <DealOfDayView />,
      show: can(PERMISSIONS.ecommerce.dealDay.list),
    },
    {
      label: "صفقة مميزة",
      value: "featured-deal",
      component: <FeaturedDealView />,
      show: can(PERMISSIONS.ecommerce.featureDeal.list),
    },
  ];
  return (
    <div className="space-y-1">
      <TabsGroup
        tabs={tabs.filter((tab) => tab.show)}
        defaultValue="coupon"
        variant="primary"
      />
    </div>
  );
}

export default CouponsView;
