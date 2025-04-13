
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { create } from 'zustand';
import URLInput from '@/modules/table/components/URLInput';
import TableBuilder from '@/modules/table/components/TableBuilder';
import ConfigurableTable from '@/modules/table/components/ConfigurableTable';
import { exampleConfigs } from '@/modules/table/utils/configs/exampleConfigs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/table/components/ui/tabs';
import LoadingSpinner from '@/modules/table/components/table/LoadingSpinner';
import ExportButton from '@/modules/table/components/ExportButton';

// Create a Zustand store for the Index page state
interface IndexState {
  url: string;
  activeTab: 'custom' | 'examples';
  isLoading: boolean;
  tableData: any[];
  setUrl: (url: string) => void;
  setActiveTab: (tab: 'custom' | 'examples') => void;
  setIsLoading: (loading: boolean) => void;
  setTableData: (data: any[]) => void;
  resetUrl: () => void;
}

const useIndexStore = create<IndexState>((set) => ({
  url: '',
  activeTab: 'custom',
  isLoading: false,
  tableData: [],
  setUrl: (url) => set({ url }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setTableData: (tableData) => set({ tableData }),
  resetUrl: () => set({ url: '', tableData: [] })
}));

const Index = () => {
  // Get state and actions from the store
  const { 
    url, 
    activeTab, 
    isLoading, 
    tableData,
    setUrl, 
    setActiveTab, 
    setIsLoading, 
    setTableData,
    resetUrl 
  } = useIndexStore();

  const handleSubmit = useCallback((submittedUrl: string) => {
    setIsLoading(true);
    
    // Simulate a brief loading period before setting the URL
    setTimeout(() => {
      setUrl(submittedUrl);
      setActiveTab('custom');
      setIsLoading(false);
    }, 800);
  }, [setUrl, setActiveTab, setIsLoading]);

  const handleReset = useCallback(() => {
    resetUrl();
  }, [resetUrl]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'custom' | 'examples');
  }, [setActiveTab]);

  // Custom search bar actions - Export button
  const renderSearchBarActions = () => (
    <ExportButton data={tableData} filename="table-data" />
  );

  // Update the table data when data changes
  const handleDataUpdate = useCallback((data: any[]) => {
    setTableData(data);
  }, [setTableData]);

  // Enhanced TableBuilder that passes data to the parent component
  const EnhancedTableBuilder = useCallback(() => {
    if (!url) return null;
    
    // Define a unique table ID for this table
    const indexTableId = "index-table";
    
    return (
      <TableBuilder
        url={url}
        config={{
          tableId: indexTableId,
          url: url
        }}
        onReset={handleReset}
        searchBarActions={renderSearchBarActions()}
      />
    );
  }, [url, handleReset, renderSearchBarActions]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-secondary/50">
      <header className="w-full py-12 px-6">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div 
            className="inline-block mb-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-medium inline-block">
              Elegant Data Visualization
            </div>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mb-4 text-foreground">
            URL Table Builder
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
            Transform any JSON API or data URL into a beautiful, interactive table with custom configurations.
          </p>
        </motion.div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-6 pb-20 flex-1 flex flex-col">
        <URLInput onSubmit={handleSubmit} />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
         <TabsList className="mb-4 mx-auto">
           <TabsTrigger value="custom">Custom URL</TabsTrigger>
           <TabsTrigger value="examples">Example Configurations</TabsTrigger>
         </TabsList>
         
         <TabsContent value="custom" className="w-full">
           <AnimatePresence mode="wait">
             {isLoading ? (
               <motion.div
                 key="loading"
                 className="flex-1 flex flex-col items-center justify-center py-12"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.3 }}
               >
                 <LoadingSpinner text="Preparing your data visualization..." />
               </motion.div>
             ) : url ? (
               <motion.div
                 key="table"
                 className="w-full"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.3 }}
               >
                 <EnhancedTableBuilder />
               </motion.div>
             ) : (
               <motion.div
                 key="placeholder"
                 className="flex-1 flex flex-col items-center justify-center py-12"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.3 }}
               >
                 <div className="glass-panel rounded-2xl p-8 max-w-lg w-full text-center">
                   <div className="rounded-full bg-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-6">
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       width="24"
                       height="24"
                       viewBox="0 0 24 24"
                       fill="none"
                       stroke="currentColor"
                       strokeWidth="2"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       className="text-primary"
                     >
                       <rect x="3" y="3" width="18" height="18" rx="2" />
                       <path d="M3 9h18" />
                       <path d="M9 21V9" />
                     </svg>
                   </div>
                   <h2 className="text-2xl font-medium mb-3">Enter a URL to begin</h2>
                   <p className="text-muted-foreground mb-6">
                     Paste any JSON API URL or data endpoint to automatically generate an interactive table.
                   </p>
                   <div className="text-sm text-muted-foreground space-y-2">
                     <p>Try these example URLs:</p>
                     <ul className="space-y-1">
                       <li><code className="bg-secondary p-1 rounded">https://jsonplaceholder.typicode.com/users</code></li>
                       <li><code className="bg-secondary p-1 rounded">https://jsonplaceholder.typicode.com/posts</code></li>
                       <li><code className="bg-secondary p-1 rounded">https://jsonplaceholder.typicode.com/todos</code></li>
                     </ul>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </TabsContent>
         
         <TabsContent value="examples" className="w-full">
           <motion.div
             className="w-full"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
           >
             <ConfigurableTable
               configs={exampleConfigs}
               searchBarActions={renderSearchBarActions()}
             />
           </motion.div>
         </TabsContent>
       </Tabs>
      </main>
    </div>
  );
};

// Import the table store
import { useTableStore } from '@/modules/table/store/useTableStore';

export default React.memo(Index);
