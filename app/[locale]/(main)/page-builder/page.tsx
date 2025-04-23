"use client";

import React, { useState, useEffect } from 'react';
import { useApiClient } from '@/utils/apiClient';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormConfig } from '@/modules/form-builder/types/formTypes';
import { TableConfig } from '@/modules/table/types/tableTypes';
import { generateFormConfig, generateTableConfig } from '@/modules/form-builder/utils/schemaConverter';
import { ConditionBuilder } from '@/components/shared/ConditionBuilder';
import { default as SheetFormBuilder } from '@/modules/form-builder/components/SheetFormBuilder';
import { Table } from '@/modules/table/components/table/Table';

interface LaravelColumn {
  name: string;
  type: string;
  required: boolean;
  nullable: boolean;
  default?: string | number | boolean | null;
  foreign_key?: {
    references: string;
    on: string;
  };
}

interface LaravelTable {
  name: string;
  columns: LaravelColumn[];
  relationships: {
    [key: string]: {
      type: string;
      model: string;
      foreign_key: string;
      local_key: string;
    };
  };
}

const PageBuilder = () => {
  const apiClient = useApiClient();
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [pageType, setPageType] = useState<'form' | 'table'>('form');
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [tableConfig, setTableConfig] = useState<TableConfig | null>(null);
  const [tables, setTables] = useState<LaravelTable[]>([]);
  const [selectedTableSchema, setSelectedTableSchema] = useState<LaravelTable | null>(null);
  interface Condition {
    field: string;
    operator: string;
    value: string;
    logicalOperator?: 'AND' | 'OR';
  }
  
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    // Fetch available tables from Laravel
    const fetchTables = async () => {
      try {
        const { data } = await apiClient.get('/schema');
        
        if (data.error) {
          console.error('Error from API:', data.error);
          setTables([]);
          return;
        }
        
        // Ensure data is an array
        const tablesArray = Array.isArray(data) ? data : Object.values(data);
        setTables(tablesArray);
      } catch (error) {
        console.error('Error fetching tables:', error);
        setTables([]);
      }
    };

    fetchTables();
  }, [apiClient]);

  const handleTableSelect = async (tableName: string) => {
    setSelectedTable(tableName);
    try {
      const { data: schema } = await apiClient.post('/api/schema', { tableName });
      setSelectedTableSchema(schema);
    } catch (error) {
      console.error('Error fetching table schema:', error);
    }
  };

  const handlePageTypeChange = (type: 'form' | 'table') => {
    setPageType(type);
    setFormConfig(null);
    setTableConfig(null);
  };

  const generateConfig = () => {
    if (!selectedTableSchema) return;

    if (pageType === 'form') {
      const config = generateFormConfig(selectedTableSchema);
      // Add conditions to fields
      if (conditions.length > 0) {
        config.sections[0].fields = config.sections[0].fields.map(field => ({
          ...field,
          condition: (values) => {
            return conditions.every(condition => {
              const value = values[condition.field];
              switch (condition.operator) {
                case 'equals':
                  return value === condition.value;
                case 'contains':
                  return value?.includes(condition.value);
                case 'greaterThan':
                  return Number(value) > Number(condition.value);
                case 'lessThan':
                  return Number(value) < Number(condition.value);
                default:
                  return true;
              }
            });
          },
        }));
      }
      setFormConfig(config);
    } else {
      const config = generateTableConfig(selectedTableSchema);
      // Add conditions to columns
      if (conditions.length > 0) {
        config.columns = config.columns.map(column => ({
          ...column,
          visible: (row: Record<string, string | number | boolean | null>) => {
            return conditions.every(condition => {
              const value = row[condition.field];
              switch (condition.operator) {
                case 'equals':
                  return value === condition.value;
                case 'contains':
                  return typeof value === 'string' ? value.includes(condition.value) : String(value).includes(condition.value);
                case 'greaterThan':
                  return Number(value) > Number(condition.value);
                case 'lessThan':
                  return Number(value) < Number(condition.value);
                default:
                  return true;
              }
            });
          },
        }));
      }
      setTableConfig(config);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Page Builder</h1>
      
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2">Page Type</label>
            <Select value={pageType} onValueChange={handlePageTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select page type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="table">Table</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block mb-2">Select Table</label>
            <Select value={selectedTable} onValueChange={handleTableSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map(table => (
                  <SelectItem key={table.name} value={table.name}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedTableSchema && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Conditions</h3>
            <ConditionBuilder
              fields={selectedTableSchema.columns.map(col => ({
                name: col.name,
                label: col.name,
                type: col.type,
              }))}
              onChange={setConditions}
            />
          </div>
        )}

        <Button
          onClick={generateConfig}
          disabled={!selectedTable}
        >
          Generate {pageType === 'form' ? 'Form' : 'Table'}
        </Button>
      </Card>

      {/* Preview Section */}
      {(formConfig || tableConfig) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          {pageType === 'form' && formConfig && (
            <SheetFormBuilder config={formConfig} />
          )}
          {pageType === 'table' && tableConfig && (
            <Table config={tableConfig} />
          )}
        </Card>
      )}
    </div>
  );
};

export default PageBuilder;