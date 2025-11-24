"use client";
import { useState } from "react";
import { useAddressListTableConfig } from "./AddressTableConfig";
import { TableBuilder, useTableReload } from "@/modules/table";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import SetAddressDialog from "./SetAddressDialog";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function AddressTable() {
    // Translations
    const t = useTranslations("content-management-system.communicationSetting.table");
    // State for editing category
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    // Table config
    const tableConfig = useAddressListTableConfig({
        onEdit: (id: string) => setEditingAddressId(id),
    });
    const { reloadTable } = useTableReload(tableConfig.tableId);

    return <Can check={[PERMISSIONS.CMS.communicationSettings.addresses.view]}>
        <div className="container p-6 bg-sidebar space-y-4">
            <h2 className="text-2xl font-bold">{t("title")}</h2>
            <Can check={[PERMISSIONS.CMS.communicationSettings.addresses.update]}>
                <SetAddressDialog
                    open={Boolean(editingAddressId)}
                    onClose={() => setEditingAddressId(null)}
                    addressId={editingAddressId || undefined}
                    onSuccess={() => reloadTable()}
                />
            </Can>
            <TableBuilder
                config={tableConfig}
                searchBarActions={
                    <Can check={[PERMISSIONS.CMS.categories.create]}>
                        <DialogTrigger
                            component={SetAddressDialog}
                            dialogProps={{ onSuccess: () => reloadTable() }}
                            render={({ onOpen }) => (
                                <Button onClick={onOpen}>
                                    {t("addAddress")}
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