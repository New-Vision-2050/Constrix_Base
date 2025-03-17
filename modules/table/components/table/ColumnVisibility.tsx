import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/table/components/ui/popover";
import { Button } from "@/modules/table/components/ui/button";
import { Checkbox } from "@/modules/table/components/ui/checkbox";
import { Label } from "@/modules/table/components/ui/label";
import { useLocale, useTranslations } from "next-intl";
import { ColumnConfig } from "@/modules/table/utils/configs/columnConfig";
import VisibilityIcon from "@/public/icons/visability";

interface ColumnVisibilityProps {
  columns: ColumnConfig[];
  visibleColumnKeys: string[];
  onToggleColumnVisibility: (columnKey: string) => void;
  onSetAllColumnsVisible: () => void;
  onSetMinimalColumnsVisible: () => void;
  columnVisibility?: {
    visible: boolean;
    keys: string[];
  };
  onSetColumnVisibility?: (visible: boolean) => void;
  onSetColumnVisibilityKeys?: (keys: string[]) => void;
}

const ColumnVisibility: React.FC<ColumnVisibilityProps> = ({
  columns,
  visibleColumnKeys,
  onToggleColumnVisibility,
  onSetAllColumnsVisible,
  onSetMinimalColumnsVisible,
  columnVisibility,
  onSetColumnVisibility,
  onSetColumnVisibilityKeys,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";

  if (columns.length === 0) return null;
  
  // Use columnVisibility state if provided, otherwise use visibleColumnKeys
  const isVisible = columnVisibility?.visible ?? true;
  const visibleKeys = columnVisibility?.keys?.length ? columnVisibility.keys : visibleColumnKeys;

  // Handle toggling the overall column visibility
  const handleToggleVisibility = () => {
    if (onSetColumnVisibility) {
      onSetColumnVisibility(!isVisible);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`flex-shrink-0 ${isVisible ? 'bg-sidebar' : 'bg-muted'}`}
          title={t("Table.ToggleColumns") || "Toggle visible columns"}
          onClick={onSetColumnVisibility ? handleToggleVisibility : undefined}
        >
          <VisibilityIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align={isRtl ? "end" : "start"}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">
              {t("Table.VisibleColumns") || "Visible Columns"}
            </h4>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={onSetAllColumnsVisible}
              >
                All
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={onSetMinimalColumnsVisible}
              >
                Minimal
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {columns.map((column) => (
              <div key={column.key} className="flex items-center gap-x-2">
                <Checkbox
                  id={`column-visibility-${column.key}`}
                  checked={visibleKeys.includes(column.key)}
                  onCheckedChange={() => {
                    if (onSetColumnVisibilityKeys && columnVisibility) {
                      // If using the new API, update the keys directly
                      const newKeys = visibleKeys.includes(column.key)
                        ? visibleKeys.filter(key => key !== column.key)
                        : [...visibleKeys, column.key];
                      onSetColumnVisibilityKeys(newKeys);
                    } else {
                      // Fall back to the old API
                      onToggleColumnVisibility(column.key);
                    }
                  }}
                />
                <Label
                  htmlFor={`column-visibility-${column.key}`}
                  className="text-sm cursor-pointer"
                >
                  {column.label}
                </Label>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {visibleKeys.length} من {columns.length} اعمدة مرئية
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnVisibility;
