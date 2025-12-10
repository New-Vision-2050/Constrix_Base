import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ThemeSettingModule from "@/modules/content-management-system/theme-setting";
import { CompanyDashboardThemeSettingApi } from "@/services/api/company-dashboard/theme-setting";

async function ThemeSettingPage() {
    const themeSettingData = await CompanyDashboardThemeSettingApi.getCurrent();
    const initialData = themeSettingData.data?.payload ?? null;
    return <ThemeSettingModule initialData={initialData} />
}

export default withServerPermissionsPage(ThemeSettingPage, [
    Object.values(PERMISSIONS.CMS.themeSetting)
]);