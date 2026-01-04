"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import IconsGrid from "./components/IconsGrid";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useMemo, useState } from "react";
import SetIconDialog from "./components/SetIconDialog";
import { useQuery } from "@tanstack/react-query";
import { CompanyDashboardIconsApi } from "@/services/api/company-dashboard/icons";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";
import withPermissions from "@/lib/permissions/client/withPermissions";
import IconsSearchBar from "./components/IconsSearchBar";
import { Pagination, Stack } from "@mui/material";

function CMSIconsModule() {
    const t = useTranslations("content-management-system.icons");
    const [editingIconId, setEditingIconId] = useState<string | null>(null);
    // searh bar states
    const [search, setSearch] = useState("");
    const [categoryType, setCategoryType] = useState("");
    const [sortBy, setSortBy] = useState("");
    // pagenation
    const [page, setPage] = useState(1);

    const OnEditIcon = (id: string) => {
        setEditingIconId(id);
    }
    // fetch icons use query
    const { data: iconsData, isLoading, refetch } = useQuery({
        queryKey: ["company-dashboard-icons", search, categoryType, page, sortBy],
        queryFn: () => CompanyDashboardIconsApi.list({
            page,
            search,
            categoryType,
            sortBy
        }),
    });


    const totalPages = useMemo(() => iconsData?.data?.pagination?.last_page || 1, [iconsData]);

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
            {/* Pagination */}
            {
                totalPages > 1 && <Stack direction="row" justifyContent="center" mt={3}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, newPage) => setPage(newPage)}
                        color="primary"
                        shape="rounded"
                    />
                </Stack>
            }

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