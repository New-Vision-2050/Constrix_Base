import React from "react";
import { Button } from "@/modules/table/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/table/components/ui/dropdown-menu";
import { useToast } from "@/modules/table/hooks/use-toast";
import { useTranslations } from "next-intl";

interface ExportButtonProps {
  data: any[];
  filename?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = "exported-data",
}) => {
  const { toast } = useToast();
  const t = useTranslations();

  if (!data || data.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Download className="mr-2 h-4 w-4" />
        {t("Table.Export")}
      </Button>
    );
  }

  const exportAsJSON = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      downloadFile(blob, `${filename}.json`);

      toast({
        title: "Export successful",
        description: `Data exported as ${filename}.json`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export data as JSON",
        variant: "destructive",
      });
    }
  };

  const exportAsCSV = () => {
    try {
      if (data.length === 0) return;

      // Get headers from the first item
      const headers = Object.keys(data[0]);

      // Convert data to CSV rows
      const csvRows = [
        // Header row
        headers.join(","),
        // Data rows
        ...data.map((item) =>
          headers
            .map((header) => {
              const value = item[header];
              // Handle null, undefined, and escape quotes
              const cell =
                value === null || value === undefined
                  ? ""
                  : typeof value === "object"
                  ? JSON.stringify(value).replace(/"/g, '""')
                  : String(value).replace(/"/g, '""');
              // Wrap with quotes if the value contains comma, newline or quotes
              return /[,\n"]/.test(cell) ? `"${cell}"` : cell;
            })
            .join(",")
        ),
      ];

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, `${filename}.csv`);

      toast({
        title: "Export successful",
        description: `Data exported as ${filename}.csv`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export data as CSV",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-sidebar" size="sm">
          <Download className="mr-2 h-4 w-4" />
          {t("Table.Export")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsCSV} dir="rtl">
          {t("Table.ExportAsCSV")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJSON} dir="rtl">
          {t("Table.ExportAsJSON")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
