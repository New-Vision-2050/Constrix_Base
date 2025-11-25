"use client";
import { useState } from "react";
import { TableBuilder, useTableReload } from "@/modules/table";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useSocialLinksListTableConfig } from "./SocialLinksTableConfig";
import SetSocialLinkDialog from "./SetSocialLinkDialog";

export default function SocialLinksTable() {
    // Translations
    const t = useTranslations("content-management-system.communicationSetting.socialLinksTable");
    // State for editing category
    const [editingSocialLinkId, setEditingSocialLinkId] = useState<string | null>(null);
    // Table config
    const tableConfig = useSocialLinksListTableConfig({
        onEdit: (id: string) => setEditingSocialLinkId(id),
    });
    const { reloadTable } = useTableReload(tableConfig.tableId);

    return <Can check={[PERMISSIONS.CMS.communicationSettings.addresses.view]}>
        <div className="container p-6 bg-sidebar space-y-4 rounded-lg  border border-border">
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <Can check={[PERMISSIONS.CMS.communicationSettings.addresses.update]}>
                <SetSocialLinkDialog
                    open={Boolean(editingSocialLinkId)}
                    onClose={() => setEditingSocialLinkId(null)}
                    socialLinkId={editingSocialLinkId || undefined}
                    onSuccess={() => reloadTable()}
                />
            </Can>
            <TableBuilder
                config={tableConfig}
                searchBarActions={
                    <Can check={[PERMISSIONS.CMS.categories.create]}>
                        <DialogTrigger
                            component={SetSocialLinkDialog}
                            dialogProps={{ onSuccess: () => reloadTable() }}
                            render={({ onOpen }) => (
                                <Button onClick={onOpen}>
                                    {t("addSocialLink")}
                                </Button>
                            )}
                        />
                    </Can>
                }
                tableId={tableConfig.tableId}
            />
        </div>
    </Can>;
}