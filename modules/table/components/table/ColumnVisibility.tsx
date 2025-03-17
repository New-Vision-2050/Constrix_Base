import React from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/table/components/ui/popover";
import { Button } from "@/modules/table/components/ui/button";
import { Checkbox } from "@/modules/table/components/ui/checkbox";
import { Label } from "@/modules/table/components/ui/label";
import { useTranslations } from "next-intl";
import { ColumnConfig } from "@/modules/table/utils/configs/columnConfig";

interface ColumnVisibilityProps {
  columns: ColumnConfig[];
  visibleColumnKeys: string[];
  onToggleColumnVisibility: (columnKey: string) => void;
  onSetAllColumnsVisible: () => void;
  onSetMinimalColumnsVisible: () => void;
}

const ColumnVisibility: React.FC<ColumnVisibilityProps> = ({
  columns,
  visibleColumnKeys,
  onToggleColumnVisibility,
  onSetAllColumnsVisible,
  onSetMinimalColumnsVisible,
}) => {
  const t = useTranslations();
  
  if (columns.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="flex-shrink-0 bg-sidebar"
          title={t("Table.ToggleColumns") || "Toggle visible columns"}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
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
              <div
                key={column.key}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`column-visibility-${column.key}`}
                  checked={visibleColumnKeys.includes(column.key)}
                  onCheckedChange={() => onToggleColumnVisibility(column.key)}
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
              {visibleColumnKeys.length} of {columns.length} columns visible
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnVisibility;