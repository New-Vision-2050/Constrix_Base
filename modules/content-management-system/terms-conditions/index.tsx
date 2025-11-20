import Can from "@/lib/permissions/client/Can";
import TermsConditionsForm from "./components/TermsConditionsForm";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function TermsConditionsModule() {
    return <Can check={[PERMISSIONS.CMS.termsConditions.view]}>
        <TermsConditionsForm />
    </Can>;
}