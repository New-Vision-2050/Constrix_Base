import { useTranslations } from "next-intl";
import CommunicationTabs from "./components/CommunicationTabs";
import { ContactInfo } from "./schema/contact-data.schema";

interface CommunicationSettingsModuleProps {
    contactInfo?: ContactInfo;
}

/**
 * Communication Settings Module
 * Main container for managing contact information, addresses, and social links
 */
export default function CommunicationSettingsView({ contactInfo }: CommunicationSettingsModuleProps) {
    const t = useTranslations("content-management-system.communicationSetting");

    return (
        <div className="px-8 py-4">
            <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
            <CommunicationTabs contactInfo={contactInfo} />
        </div>
    );
}