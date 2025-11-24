import TermsConditionsForm from "./components/TermsConditionsForm";
import { TermsConditions } from "@/services/api/company-dashboard/terms-conditions/types/response";
interface TermsConditionsViewProps {
    initialData: TermsConditions | null;
}

export default function TermsConditionsView({ initialData: termsConditionsData }: TermsConditionsViewProps) {
    return <TermsConditionsForm termsConditionsData={termsConditionsData} />;
}