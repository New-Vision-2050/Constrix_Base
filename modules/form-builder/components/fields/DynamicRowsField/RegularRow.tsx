import React, { memo } from "react";
import { Label } from "@/modules/table/components/ui/label";
import { Button } from "@/modules/table/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchField from "../SearchField";
import { RegularRowProps } from "./types";

// Component for a single row (non-sortable version)
const RegularRow = memo(({
  rowIndex,
  rowData,
  fields,
  onFieldChange,
  onDeleteRow,
  isDeleteDisabled,
  rowErrors,
  columnsPerRow,
  touched
}: RegularRowProps) => {
  // Render a field based on its type
  const renderField = (fieldConfig: any) => {
    // Create a unique field name for this row
    const rowFieldName = `${fieldConfig.name}-${rowIndex}`;
    
    // Get the field value
    const fieldValue = rowData[fieldConfig.name] !== undefined ? rowData[fieldConfig.name] : fieldConfig.defaultValue;
    
    // Render a simplified version of the field based on its type
    switch (fieldConfig.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={rowFieldName}>{fieldConfig.label}</Label>
            <input
              id={rowFieldName}
              type={fieldConfig.type}
              value={fieldValue || ''}
              placeholder={fieldConfig.placeholder}
              disabled={fieldConfig.disabled}
              readOnly={fieldConfig.readOnly}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                fieldConfig.className
              )}
              onChange={(e) => onFieldChange(rowIndex, fieldConfig.name, e.target.value)}
            />
            {fieldConfig.helperText && <p className="text-sm text-muted-foreground">{fieldConfig.helperText}</p>}
          </div>
        );
        
      case 'textarea':
        return (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={rowFieldName}>{fieldConfig.label}</Label>
            <textarea
              id={rowFieldName}
              value={fieldValue || ''}
              placeholder={fieldConfig.placeholder}
              disabled={fieldConfig.disabled}
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                fieldConfig.className
              )}
              onChange={(e) => onFieldChange(rowIndex, fieldConfig.name, e.target.value)}
            />
            {fieldConfig.helperText && <p className="text-sm text-muted-foreground">{fieldConfig.helperText}</p>}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              id={rowFieldName}
              type="checkbox"
              checked={!!fieldValue}
              disabled={fieldConfig.disabled}
              className={cn(
                "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
                fieldConfig.className
              )}
              onChange={(e) => onFieldChange(rowIndex, fieldConfig.name, e.target.checked)}
            />
            <Label htmlFor={rowFieldName}>{fieldConfig.label}</Label>
            {fieldConfig.helperText && <p className="text-sm text-muted-foreground">{fieldConfig.helperText}</p>}
          </div>
        );
        
      case 'select':
        return (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={rowFieldName}>{fieldConfig.label}</Label>
            <SearchField
              field={{
                ...fieldConfig,
                name: rowFieldName,
                // If searchType contains dynamicDropdown, use it as dynamicOptions
                dynamicOptions: fieldConfig.searchType?.dynamicDropdown || fieldConfig.dynamicOptions,
                // Make sure to pass the searchType property if it exists
                searchType: fieldConfig.searchType,
              }}
              value={fieldValue || ''}
              onChange={(value) => onFieldChange(rowIndex, fieldConfig.name, value)}
              onBlur={() => {}}
              dependencyValues={rowData}
            />
          </div>
        );
        
      case 'date':
        return (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={rowFieldName}>{fieldConfig.label}</Label>
            <input
              id={rowFieldName}
              type="date"
              value={fieldValue ? new Date(fieldValue).toISOString().split('T')[0] : ''}
              disabled={fieldConfig.disabled}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                fieldConfig.className
              )}
              onChange={(e) => onFieldChange(rowIndex, fieldConfig.name, e.target.value ? new Date(e.target.value) : null)}
            />
            {fieldConfig.helperText && <p className="text-sm text-muted-foreground">{fieldConfig.helperText}</p>}
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor={rowFieldName}>{fieldConfig.label}</Label>
            <p className="text-sm text-muted-foreground">
              Field type '{fieldConfig.type}' is not directly supported in dynamic rows.
              Please use a simpler field type or implement a custom renderer.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="flex items-start gap-4 p-4 border rounded-md mb-2 bg-background">
      <div className={`flex-1 grid gap-4 w-full ${
        columnsPerRow === 1 ? 'grid-cols-1' :
        columnsPerRow === 2 ? 'grid-cols-1 md:grid-cols-2' :
        columnsPerRow === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        columnsPerRow === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
        'grid-cols-1' // Default to 1 column
      }`}>
        {fields.map((fieldConfig) => (
          <div key={fieldConfig.name} className="flex flex-col space-y-1.5">
            {fieldConfig.type !== 'checkbox' && (
              <Label htmlFor={`${fieldConfig.name}-${rowIndex}`}>
                {fieldConfig.label}
                {fieldConfig.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            {renderField(fieldConfig)}
            {touched && rowErrors && rowErrors[fieldConfig.name] && (
              <p className="text-sm text-destructive mt-1">{rowErrors[fieldConfig.name]}</p>
            )}
          </div>
        ))}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteRow(rowIndex)}
        disabled={isDeleteDisabled}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
});

RegularRow.displayName = "RegularRow";

export default RegularRow;