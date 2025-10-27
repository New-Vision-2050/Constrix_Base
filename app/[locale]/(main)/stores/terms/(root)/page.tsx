import TermsConditionsView from "@/modules/stores/terms/list/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Manage terms and conditions",
};

function TermsConditionsPage() {
  return <TermsConditionsView />;
}

export default TermsConditionsPage;
