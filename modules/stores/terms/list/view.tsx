"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import TermsTabView from "./views/terms-tab";
import PrivacyTabView from "./views/privacy-tab";
import ReturnTabView from "./views/return-tab";
import ShippingTabView from "./views/shipping-tab";
import PaymentTabView from "./views/payment-tab";
import CancellationTabView from "./views/cancellation-tab";
import AboutTabView from "./views/about-tab";
import CompanyTabView from "./views/company-tab";

function TermsConditionsView() {
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
            value: "return",
            component: <ReturnTabView />,
          },
          {
            label: "سياسة الإرجاع",
            value: "shipping",
            component: <ShippingTabView />,
          },
          {
            label: "سياسة الدفع",
            value: "payment",
            component: <PaymentTabView />,
          },
          {
            label: "سياسة الإلغاء",
            value: "cancellation",
            component: <CancellationTabView />,
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
