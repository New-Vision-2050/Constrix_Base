"use client";
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/modules/table/hooks/use-toast';
import { useApiClient } from '@/utils/apiClient';
import { AxiosError } from 'axios';

interface ExportButtonProps {
  url: string;
  selectedRows: Record<string | number, boolean>;
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  url,
  selectedRows,
  disabled = false
}) => {
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const apiClient = useApiClient();

  // Get the selected row IDs
  const selectedIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
  const hasSelectedRows = selectedIds.length > 0;

  // Construct the export URL by appending "/export" to the base URL
  const exportUrl = `${url.endsWith('/') ? url.slice(0, -1) : url}/export`;

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setLoading(true);

      // Make the API call with the selected row IDs
      const response = await apiClient.post(exportUrl, {
        ids: selectedIds,
        format,
      }, {
        responseType: 'blob', // Important for handling file streams
      });

      // Get the filename from the Content-Disposition header or use a default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `export.${format}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Download the file
      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: t('Table.ExportSuccess'),
        description: `${selectedIds.length} ${t('Table.ItemsExported')}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: t('Table.ExportFailed'),
        description: axiosError.response?.data?.message || (error instanceof Error ? error.message : String(error)),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          disabled={disabled || loading }
        >
          <Download className="h-4 w-4 mr-1" />
          {t('Table.Export')}
          {hasSelectedRows && ` (${selectedIds.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          {t('Table.ExportAsCSV')}
        </DropdownMenuItem>
        {/*<DropdownMenuItem onClick={() => handleExport('json')}>*/}
        {/*  {t('Table.ExportAsJSON')}*/}
        {/*</DropdownMenuItem>*/}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
