import EmptyStatisticsCard from "@/modules/dashboard/components/statistics-cards/components/empty-card";
import { useTranslations } from "next-intl";

export default function ClientProfileStatisticsCards() {
    // Translations
    const t = useTranslations("ClientProfile");
    return (
        <div className="flex flex-col gap-4">
            <EmptyStatisticsCard
                title={t("sections.financialReport.title")}
                description={t("sections.financialReport.emptyDescription")}
            />
            
            <EmptyStatisticsCard title={t("sections.projects.title")} description={t("sections.projects.emptyDescription")} />

            <EmptyStatisticsCard title={t("sections.invoices.title")} description={t("sections.invoices.emptyDescription")} />
        </div>
    );
}