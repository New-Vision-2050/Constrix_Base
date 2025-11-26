import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ThemeSettingModule from "@/modules/content-management-system/theme-setting";

function ThemeSettingPage() {
    return <ThemeSettingModule />
}

export default withServerPermissionsPage(ThemeSettingPage, [
    Object.values(PERMISSIONS.CMS.themeSetting)
]);