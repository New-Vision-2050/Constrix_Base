import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { ContactDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { useContactTableConfig } from "../../../_config/contactTableConfig";

interface ContactBannersTableProps {
  onLoaded?: () => void;
}

export function ContactBannersTable({ onLoaded }: ContactBannersTableProps) {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const initRef = useRef(false);
  const t = useTranslations("pagesSettings");

  const tableConfig = useContactTableConfig({
    onEdit: (id: string) => setEditingPageId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      console.log("ContactBannersTable initializing");
      setMounted(true);
    }
  }, []);

  // Separate effect to call onLoaded after component is fully mounted and rendered
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        console.log("ContactBannersTable calling onLoaded");
        onLoaded?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, onLoaded]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ContactDialog
        open={Boolean(editingPageId)}
        onClose={() => setEditingPageId(null)}
        pageId={editingPageId || undefined}
        onSuccess={() => reloadTable()}
      />
      
      <div>
        <h2 className="text-xl font-bold text-white mb-4">لافتات التواصل</h2>
        <TableBuilder
          key={tableConfig.tableId}
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
    </>
  );
}
