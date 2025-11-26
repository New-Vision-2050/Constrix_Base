import { ClientProfileData } from "@/app/[locale]/(main)/client-profile/[id]/types";
import ClientProfileHeader from "./components/ClientProfileHeader";
import ClientProfileStatisticsCards from "./components/statistics-cards";
import EmptyUserDataSection from "../dashboard/components/EmptyUserDataSection";
import { Button } from "@mui/material";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type PropsT = {
    profileData: ClientProfileData;
}

export default function ClientProfileModule({ profileData }: PropsT) {
    // Translations
    const t = useTranslations("ClientProfile");

    return (
        <div className="px-6 py-4 flex flex-col gap-4">
            <ClientProfileHeader profileData={profileData} />
            {/* grid have 3 columns in md and 1 column in xs*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* statistics cards */}
                <ClientProfileStatisticsCards />
                {/* user logs */}
                <EmptyUserDataSection title={t("sections.activityLog.title")} description={t("sections.activityLog.emptyDescription")} />
                {/* incoming meetings */}
                <EmptyUserDataSection title={t("sections.upcomingMeetings.title")} description={t("sections.upcomingMeetings.emptyDescription")} actionsBtn={<Button variant="text" color="primary" startIcon={<PlusIcon />}>{t("sections.upcomingMeetings.requestMeetingBtn")}</Button>} />
            </div>
            {/* projects */}
            <EmptyUserDataSection title={t("sections.projects.title")} description={t("sections.projects.emptyDescription")} />
            {/* requests */}
            <EmptyUserDataSection title={t("sections.requests.title")} description={t("sections.requests.emptyDescription")} />
            {/* price offers */}
            <EmptyUserDataSection title={t("sections.priceOffers.title")} description={t("sections.priceOffers.emptyDescription")} />
            {/* contracts */}
            <EmptyUserDataSection title={t("sections.contracts.title")} description={t("sections.contracts.emptyDescription")} />
        </div>
    );
}