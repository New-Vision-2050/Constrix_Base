import TermsConditionsView from "@/modules/content-management-system/terms-conditions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import { CompanyDashboardTermsConditionsApi } from "@/services/api/company-dashboard/terms-conditions";

export default withServerPermissionsPage(
    async function TermsConditionsPage() {
        const termsConditionsData = await CompanyDashboardTermsConditionsApi.getCurrent();
        return <TermsConditionsView initialData={termsConditionsData.data?.payload ?? null} />
    },
    [PERMISSIONS.CMS.termsConditions.view]
);
