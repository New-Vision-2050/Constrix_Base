"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import IconsGrid from "./components/IconsGrid";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useState } from "react";
import SetIconDialog from "./components/SetIconDialog";
import { useQuery } from "@tanstack/react-query";
import { CompanyDashboardIconsApi } from "@/services/api/company-dashboard/icons";

export default function CMSIconsModule() {
    const t = useTranslations("content-management-system.icons");
    const [editingIconId, setEditingIconId] = useState<string | null>(null);

    const OnEditIcon = (id: string) => {
        setEditingIconId(id);
    }
    // fetch icons use query
    const { data: iconsData, isLoading, refetch } = useQuery({
        queryKey: ["company-dashboard-icons"],
        queryFn: () => CompanyDashboardIconsApi.list(),
    });

    const OnDeleteIcon = (id: string) => {
        try {
            CompanyDashboardIconsApi.delete(id);
            refetch();
        } catch (error) {
            console.error(error);
        }
    }

    return <div className="px-6 py-2 flex flex-col gap-4">
        {/* title & add action */}
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <DialogTrigger
                component={SetIconDialog}
                dialogProps={{ onSuccess: () => { refetch() } }}
                render={({ onOpen }) => (
                    <Button onClick={onOpen}>
                        <PlusIcon />
                        {t("addIcon")}
                    </Button>
                )}
            />
        </div>
        {/* icons grid */}
        <IconsGrid OnDelete={OnDeleteIcon} icons={iconsData?.data?.payload || []} isLoading={isLoading} OnEdit={OnEditIcon} />
        <SetIconDialog
            open={Boolean(editingIconId)}
            onClose={() => setEditingIconId(null)}
            iconId={editingIconId || undefined}
            onSuccess={() => { refetch() }}
        />
    </div>
}
