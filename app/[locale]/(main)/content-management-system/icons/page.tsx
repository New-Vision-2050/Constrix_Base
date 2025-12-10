import CMSIconsModule from "@/modules/content-management-system/icons";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";

function CMSIconsPage() {
    return <CMSIconsModule />
}

export default withServerPermissionsPage(CMSIconsPage, [
    Object.values(PERMISSIONS.CMS.icons)
]);