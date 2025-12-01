import AboutSettingView from "@/modules/content-management-system/about-setting";
import { CompanyDashboardAboutApi } from "@/services/api/company-dashboard/about";

export default async function AboutSettingPage() {
    const aboutUsData = await CompanyDashboardAboutApi.getCurrent();
    return (
        <AboutSettingView initialData={aboutUsData.data?.payload ?? null} />
    );
}
