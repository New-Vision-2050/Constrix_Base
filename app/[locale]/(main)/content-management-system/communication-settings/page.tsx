import CommunicationSettingsModule from "@/modules/content-management-system/communication-settings";
import { CommunicationWebsiteContactInfoApi } from "@/services/api/company-dashboard/communication-settings/contact-info";

export default async function CommunicationSettingsPage() {
    let contactInfo = null;
    
    try {
        const response = await CommunicationWebsiteContactInfoApi.getCurrent();
        contactInfo = response?.data?.payload;
    } catch (error) {
        // Handle error silently on server, will be handled by client components
        console.error("Failed to fetch contact info:", error);
    }
    
    return <CommunicationSettingsModule contactInfo={contactInfo} />;
}