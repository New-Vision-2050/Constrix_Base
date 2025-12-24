"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import TermsTabView from "./views/terms-tab";
import PrivacyTabView from "./views/privacy-tab";
import ReturnTabView from "./views/return-tab";
import ShippingTabView from "./views/shipping-tab";
import ShippingPolicyTabView from "./views/shipping-policy-tab";
import CancellationTabView from "./views/cancellation-tab";
import AboutTabView from "./views/about-tab";
import CompanyTabView from "./views/company-tab";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Tab } from "@/types/Tab";

type ShowableTab = Tab & { show: boolean };

function TermsConditionsView() {
  const { can } = usePermissions();

  const tabs: ShowableTab[] = [
    {
      label: "الشروط",
      value: "terms",
      component: <TermsTabView />,
      show: can(PERMISSIONS.ecommerce.page.view),
    },
    {
      label: "سياسة الخصوصية",
      value: "privacy",
      component: <PrivacyTabView />,
      show: can(PERMISSIONS.ecommerce.page.view),
    },
    {
      label: "سياسة الاسترداد",
      value: "refund",
      component: <ReturnTabView />,
      show: can(PERMISSIONS.ecommerce.page.view),
    },
    {
      label: "سياسة الإرجاع",
      value: "return",
      component: <ShippingTabView />,
      show: can(PERMISSIONS.ecommerce.page.view),
    },
    {
      label: "سياسة الإلغاء",
      value: "cancellation",
      component: <CancellationTabView />,
      show: can(PERMISSIONS.ecommerce.page.view),
    },
    {
      label: "سياسة الشحن",
      value: "shipping",
      component: <ShippingPolicyTabView />,
      show: can(PERMISSIONS.ecommerce.page.view),
    },
    {
      label: "لمحة عنا",
      value: "about",
      component: <AboutTabView />,
      show: can(PERMISSIONS.ecommerce.page.view),
    },
    {
      label: "موثوقية الشركة",
      value: "company",
      component: <CompanyTabView />,
      show: can(PERMISSIONS.ecommerce.page.view),
    },
  ];

  return (
    <div className="space-y-1">
      <TabsGroup
        tabs={[
          {
            label: "الشروط",
            value: "terms",
            component: <TermsTabView />,
          },
          {
            label: "سياسة الخصوصية",
            value: "privacy",
            component: <PrivacyTabView />,
          },
          {
            label: "سياسة الاسترداد",
            value: "refund",
            component: <ReturnTabView />,
          },
          {
            label: "سياسة الإرجاع",
            value: "return",
            component: <ShippingTabView />,
          },
          {
            label: "سياسة الإلغاء",
            value: "cancellation",
            component: <CancellationTabView />,
          },
          {
            label: "سياسة الشحن",
            value: "shipping",
            component: <ShippingPolicyTabView />,
          },
          {
            label: "لمحة عنا",
            value: "about",
            component: <AboutTabView />,
          },
          {
            label: "موثوقية الشركة",
            value: "company",
            component: <CompanyTabView />,
          },
        ]}
        defaultValue="terms"
        variant="primary"
      />
    </div>
  );
}

export default TermsConditionsView;
