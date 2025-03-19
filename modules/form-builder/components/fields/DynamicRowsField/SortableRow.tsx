import React, { memo } from "react";
import { Label } from "@/modules/table/components/ui/label";
import { Button } from "@/modules/table/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SearchField from "../SearchField";
import { SortableRowProps } from "./types";

// Component for a single sortable row
const SortableRow = memo(({
  id,
  rowIndex,
  rowData,
  fields,
  onFieldChange,
  onDeleteRow,
  isDeleteDisabled,
  rowErrors,
  columnsPerRow
}: SortableRowProps) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Use FormField component to render each field
  const renderField = (field: any) => {
    // Create a unique field name for this row
    const rowFieldName = `${field.name}-${rowIndex}`;
    
    // Get the field value
    const fieldValue = rowData[field.name] !== undefined ? rowData[field.name] : field.defaultValue;
    
    // Instead of using FormField which might cause infinite loops,
    // we'll render a simplified version of the field based on its type
    const renderSimplifiedField = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
          return (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={rowFieldName}>{field.label}</Label>
              <input
                id={rowFieldName}
                type={field.type}
                value={fieldValue || ''}
                placeholder={field.placeholder}
                disabled={field.disabled}
                readOnly={field.readOnly}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  field.className
                )}
                onChange={(e) => onFieldChange(rowIndex, field.name, e.target.value)}
              />
              {field.helperText && <p className="text-sm text-muted-foreground">{field.helperText}</p>}
            </div>
          );
          
        case 'textarea':
          return (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={rowFieldName}>{field.label}</Label>
              <textarea
                id={rowFieldName}
                value={fieldValue || ''}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={cn(
                  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  field.className
                )}
                onChange={(e) => onFieldChange(rowIndex, field.name, e.target.value)}
              />
              {field.helperText && <p className="text-sm text-muted-foreground">{field.helperText}</p>}
            </div>
          );
          
        case 'checkbox':
          return (
            <div className="flex items-center space-x-2">
              <input
                id={rowFieldName}
                type="checkbox"
                checked={!!fieldValue}
                disabled={field.disabled}
                className={cn(
                  "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
                  field.className
                )}
                onChange={(e) => onFieldChange(rowIndex, field.name, e.target.checked)}
              />
              <Label htmlFor={rowFieldName}>{field.label}</Label>
              {field.helperText && <p className="text-sm text-muted-foreground">{field.helperText}</p>}
            </div>
          );
          
        case 'select':
          return (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={rowFieldName}>{field.label}</Label>
              <SearchField
                field={{
                  ...field,
                  name: rowFieldName,
                  // If searchType contains dynamicDropdown, use it as dynamicOptions
                  dynamicOptions: field.searchType?.dynamicDropdown || field.dynamicOptions,
                  // Make sure to pass the searchType property if it exists
                  searchType: field.searchType,
                }}
                value={fieldValue || ''}
                onChange={(value) => onFieldChange(rowIndex, field.name, value)}
                onBlur={() => {}}
                dependencyValues={rowData}
              />
            </div>
          );
          
        case 'date':
          return (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={rowFieldName}>{field.label}</Label>
              <input
                id={rowFieldName}
                type="date"
                value={fieldValue ? new Date(fieldValue).toISOString().split('T')[0] : ''}
                disabled={field.disabled}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  field.className
                )}
                onChange={(e) => onFieldChange(rowIndex, field.name, e.target.value ? new Date(e.target.value) : null)}
              />
              {field.helperText && <p className="text-sm text-muted-foreground">{field.helperText}</p>}
            </div>
          );
          
        default:
          return (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={rowFieldName}>{field.label}</Label>
              <p className="text-sm text-muted-foreground">
                Field type '{field.type}' is not directly supported in dynamic rows.
                Please use a simpler field type or implement a custom renderer.
              </p>
            </div>
          );
      }
    };
    
    return renderSimplifiedField();
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "flex items-start gap-4 p-4 border rounded-md mb-2 bg-background",
        isDragging ? "border-primary" : "border-input"
      )}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab flex items-center h-full pt-2"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
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
            {fieldConfig.helperText && (
              <p className="text-sm text-muted-foreground">{fieldConfig.helperText}</p>
            )}
            {rowErrors && rowErrors[fieldConfig.name] && (
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

SortableRow.displayName = "SortableRow";

export default SortableRow;