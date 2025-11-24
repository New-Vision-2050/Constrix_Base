import { useTranslations } from "next-intl";
import ContactDataForm from "./components/ContactDataForm";
import AddressTable from "./components/address-table";

export default function CommunicationSettingsModule() {
    // Translations
    const t = useTranslations("content-management-system.communicationSetting");

    return (
        <div className="px-6 py-2 flex flex-col gap-4">
            <ContactDataForm />
            <AddressTable />
        </div>
    );
}