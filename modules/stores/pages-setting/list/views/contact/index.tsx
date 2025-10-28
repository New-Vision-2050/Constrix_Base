"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { ContactDialog, BranchDialog, NewFeatureDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useContactTableConfig } from "../../../_config/contactTableConfig";
import { useBranchTableConfig } from "../../../_config/branchTableConfig";
import { useNewFeatureTableConfig } from "../../../_config/newFeatureTableConfig";

function ContactView() {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const t = useTranslations("pagesSettings");

  const tableConfig = useContactTableConfig({
    onEdit: (id: string) => setEditingPageId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  const branchTableConfig = useBranchTableConfig({
    onEdit: (id: string) => setEditingBranchId(id),
  });
  const { reloadTable: reloadBranchTable } = useTableReload(branchTableConfig.tableId);

  const newFeatureTableConfig = useNewFeatureTableConfig({
    onEdit: (id: string) => setEditingFeatureId(id),
  });
  const { reloadTable: reloadFeatureTable } = useTableReload(newFeatureTableConfig.tableId);

  return (
    <div className="w-full" dir="rtl">
      <ContactDialog
        open={Boolean(editingPageId)}
        onClose={() => setEditingPageId(null)}
        pageId={editingPageId || undefined}
        onSuccess={() => reloadTable()}
      />

      <BranchDialog
        open={Boolean(editingBranchId)}
        onClose={() => setEditingBranchId(null)}
        branchId={editingBranchId || undefined}
        onSuccess={() => reloadBranchTable()}
      />

      <NewFeatureDialog
        open={Boolean(editingFeatureId)}
        onClose={() => setEditingFeatureId(null)}
        featureId={editingFeatureId || undefined}
        onSuccess={() => reloadFeatureTable()}
      />

      <div className="max-w-8xl mx-auto space-y-8">
        {/* Contact Banners Table */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">لافتات التواصل</h2>
          <TableBuilder
            config={tableConfig}
            searchBarActions={
              <>
                <DialogTrigger
                  component={ContactDialog}
                  dialogProps={{
                    onSuccess: () => reloadTable(),
                  }}
                  render={({ onOpen }) => (
                    <Button onClick={onOpen}>{t("actions.addBanner")}</Button>
                  )}
                />
              </>
            }
            tableId={tableConfig.tableId}
          />
        </div>

        {/* Branches Table */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">الفروع</h2>
          <TableBuilder
            config={branchTableConfig}
            searchBarActions={
              <>
                <DialogTrigger
                  component={BranchDialog}
                  dialogProps={{
                    onSuccess: () => reloadBranchTable(),
                  }}
                  render={({ onOpen }) => (
                    <Button onClick={onOpen}>اضافة فرع جديد</Button>
                  )}
                />
              </>
            }
            tableId={branchTableConfig.tableId}
          />
        </div>

        {/* New Features Table */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">ميزات جديدة</h2>
          <TableBuilder
            config={newFeatureTableConfig}
            searchBarActions={
              <>
                <DialogTrigger
                  component={NewFeatureDialog}
                  dialogProps={{
                    onSuccess: () => reloadFeatureTable(),
                  }}
                  render={({ onOpen }) => (
                    <Button onClick={onOpen}>اضافة ميزة جديدة</Button>
                  )}
                />
              </>
            }
            tableId={newFeatureTableConfig.tableId}
          />
        </div>
      </div>
    </div>
  );
}

export default ContactView;
