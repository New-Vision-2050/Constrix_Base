import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import ContactSettingModule from "@/modules/content-management-system/contact-setting";

function ContactSettingPage() {
    return (
        <ContactSettingModule />
    );
}

export default withServerPermissionsPage(ContactSettingPage, [
    Object.values(PERMISSIONS.CMS.contactSetting)
]);