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
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";
import withPermissions from "@/lib/permissions/client/withPermissions";
import IconsSearchBar from "./components/IconsSearchBar";

function CMSIconsModule() {
    const t = useTranslations("content-management-system.icons");
    const [editingIconId, setEditingIconId] = useState<string | null>(null);
    // searh bar states
    const [search, setSearch] = useState("");
    const [categoryType, setCategoryType] = useState("");
    const [sortBy, setSortBy] = useState("");

    const OnEditIcon = (id: string) => {
        setEditingIconId(id);
    }
    // fetch icons use query
    const { data: iconsData, isLoading, refetch } = useQuery({
        queryKey: ["company-dashboard-icons", search, categoryType, sortBy],
        queryFn: () => CompanyDashboardIconsApi.list({
            search,
            categoryType,
            sortBy
        }),
    });

    const OnDeleteIcon = async (id: string) => {
        try {
            await CompanyDashboardIconsApi.delete(id);
            refetch();
        } catch (error) {
            console.error(error);
        }
    }

    return <div className="px-6 py-2 flex flex-col gap-4">
        {/* icons grid */}
        <Can check={[PERMISSIONS.CMS.icons.list]}>
            <IconsSearchBar
                search={search}
                onSearchChange={setSearch}
                CategoryType={categoryType}
                onCategoryTypeChange={setCategoryType}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                actions={
                    <Can check={[PERMISSIONS.CMS.icons.create]}>
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
                    </Can>
                }
            />
            <IconsGrid OnDelete={OnDeleteIcon} icons={iconsData?.data?.payload || []} isLoading={isLoading} OnEdit={OnEditIcon} />
        </Can>
        <Can check={[PERMISSIONS.CMS.icons.update]}>
            <SetIconDialog
                open={Boolean(editingIconId)}
                onClose={() => setEditingIconId(null)}
                iconId={editingIconId || undefined}
                onSuccess={() => { refetch() }}
            />
        </Can>

    </div>
}

export default withPermissions(CMSIconsModule, [PERMISSIONS.CMS.icons.list]);