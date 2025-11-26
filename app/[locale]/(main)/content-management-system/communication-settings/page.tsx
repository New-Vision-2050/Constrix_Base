import CommunicationSettingsView from "@/modules/content-management-system/communication-settings";
import { CommunicationWebsiteContactInfoApi } from "@/services/api/company-dashboard/communication-settings/contact-info";

export default async function CommunicationSettingsPage() {
    const response = await CommunicationWebsiteContactInfoApi.getCurrent();
    const contactInfo = response?.data?.payload;

    return <CommunicationSettingsView contactInfo={contactInfo} />;
}