import { useTranslations } from "next-intl";

export default function CommunicationSettingsModule() {
    // Translations
    const t = useTranslations("content-management-system.communicationSetting");
    
    return (
        <div className="px-6 py-2 flex flex-col gap-4">
            <h1>{t("title")}</h1>
        </div>
    );
}