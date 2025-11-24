"use client";
import { useState } from "react";
import { useAddressListTableConfig } from "./AddressTableConfig";
import { TableBuilder, useTableReload } from "@/modules/table";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function AddressTable() {
    // State for editing category
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    // Table config
    const tableConfig = useAddressListTableConfig({
        onEdit: (id: string) => setEditingAddressId(id),
    });
    const { reloadTable } = useTableReload(tableConfig.tableId);

    return <Can check={[PERMISSIONS.CMS.communicationSettings.addresses.view]}>
        <div className="container p-6">
            {/* <Can check={[PERMISSIONS.CMS.communicationSettings.addresses.update]}>
                <SetAddressDialog
                    open={Boolean(editingAddressId)}
                    onClose={() => setEditingAddressId(null)}
                    addressId={editingAddressId || undefined}
                    onSuccess={() => reloadTable()}
                />
            </Can> */}
            <TableBuilder
                config={tableConfig}
                searchBarActions={
                    <Can check={[PERMISSIONS.CMS.categories.create]}>
                        {/* <DialogTrigger
                            component={SetCategoryDialog}
                            dialogProps={{ onSuccess: () => reloadTable() }}
                            render={({ onOpen }) => (
                                <Button onClick={onOpen}>
                                    {t("addCategory")}
                                </Button>
                            )}
                        /> */}
                        add address
                    </Can>
                }
                tableId={tableConfig.tableId}
            />
        </div>
    </Can>;
}