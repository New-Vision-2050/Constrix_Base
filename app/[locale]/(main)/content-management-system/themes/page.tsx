import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ThemesView from "@/modules/content-management-system/themes";

function ThemesPage() {
    return <ThemesView />
}

export default withServerPermissionsPage(ThemesPage, [
    Object.values(PERMISSIONS.CMS.themes)
]);