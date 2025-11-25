import { useTranslations } from "next-intl";
import ContactDataForm from "./components/ContactDataForm";
import AddressTable from "./components/address-table";
import SocialLinksTable from "./components/social-links-table";
import { ContactInfo } from "./schema/contact-data.schema";

interface CommunicationSettingsModuleProps {
    contactInfo?: ContactInfo;
}

export default function CommunicationSettingsModule({ contactInfo }: CommunicationSettingsModuleProps) {
    // Translations
    const t = useTranslations("content-management-system.communicationSetting");

    return (
        <div  className="px-8 py-4 flex flex-col gap-4">
            <ContactDataForm initialValues={contactInfo} />
            <AddressTable />
            <SocialLinksTable />
        </div>
    );
}