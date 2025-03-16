
import React from 'react';
import { TableConfig } from '@/modules/table/utils/configs/tableConfig';
import TableBuilder from './TableBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/table/components/ui/tabs";

interface ConfigurableTableProps {
  configs: Record<string, TableConfig>;
  defaultTab?: string;
  searchBarActions?: React.ReactNode; // New prop for custom actions
}

const ConfigurableTable: React.FC<ConfigurableTableProps> = ({ 
  configs, 
  defaultTab,
  searchBarActions
}) => {
  const tabKeys = Object.keys(configs);
  const defaultTabKey = defaultTab || tabKeys[0];
  
  if (tabKeys.length === 0) {
    return <div>No configurations provided</div>;
  }
  
  return (
    <div className="w-full">
      <Tabs defaultValue={defaultTabKey} className="w-full">
        <TabsList className="mb-4">
          {tabKeys.map((key) => (
            <TabsTrigger key={key} value={key} className="capitalize">
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabKeys.map((key) => (
          <TabsContent key={key} value={key} className="w-full">
            <TableBuilder 
              config={configs[key]} 
              searchBarActions={searchBarActions} 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ConfigurableTable;
