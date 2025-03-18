import React, { memo, useCallback, useState, useEffect } from "react";
import { FieldConfig, DynamicRowFieldConfig } from "../../types/formTypes";
import { Button } from "@/modules/table/components/ui/button";
import { Input } from "@/modules/table/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Checkbox } from "@/modules/table/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/modules/table/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/table/components/ui/select";
import { Label } from "@/modules/table/components/ui/label";
import { Calendar } from "@/modules/table/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/table/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface DynamicRowsFieldProps {
  field: FieldConfig;
  value: any[];
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: any[]) => void;
  onBlur: () => void;
}

// Component for a single sortable row
const SortableRow = memo(({ 
  id, 
  rowIndex, 
  rowData, 
  fields, 
  onFieldChange, 
  onDeleteRow, 
  isDeleteDisabled 
}: { 
  id: string;
  rowIndex: number;
  rowData: Record<string, any>;
  fields: DynamicRowFieldConfig[];
  onFieldChange: (rowIndex: number, fieldName: string, value: any) => void;
  onDeleteRow: (rowIndex: number) => void;
  isDeleteDisabled: boolean;
}) => {
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

  // Render a field based on its type
  const renderField = (field: DynamicRowFieldConfig) => {
    const fieldValue = rowData[field.name] !== undefined ? rowData[field.name] : field.defaultValue;
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Input
            id={`${field.name}-${rowIndex}`}
            name={field.name}
            type={field.type}
            value={fieldValue || ""}
            placeholder={field.placeholder}
            disabled={field.disabled}
            readOnly={field.readOnly}
            className={cn(
              field.width ? field.width : "w-full",
            )}
            onChange={(e) => onFieldChange(rowIndex, field.name, e.target.value)}
            dir={isRtl ? "rtl" : "ltr"}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={`${field.name}-${rowIndex}`}
            name={field.name}
            value={fieldValue || ""}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={cn(
              field.width ? field.width : "w-full",
            )}
            onChange={(e) => onFieldChange(rowIndex, field.name, e.target.value)}
            dir={isRtl ? "rtl" : "ltr"}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${field.name}-${rowIndex}`}
              checked={!!fieldValue}
              disabled={field.disabled}
              onCheckedChange={(checked) => onFieldChange(rowIndex, field.name, checked)}
            />
            <Label htmlFor={`${field.name}-${rowIndex}`}>{field.label}</Label>
          </div>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={fieldValue || ""}
            onValueChange={(value) => onFieldChange(rowIndex, field.name, value)}
            disabled={field.disabled}
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.name}-${option.value}-${rowIndex}`} />
                <Label htmlFor={`${field.name}-${option.value}-${rowIndex}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'select':
        return (
          <Select
            value={fieldValue || ""}
            onValueChange={(value) => onFieldChange(rowIndex, field.name, value)}
            disabled={field.disabled}
          >
            <SelectTrigger className={cn(field.width ? field.width : "w-full")}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !fieldValue && "text-muted-foreground",
                  field.width ? field.width : "w-full"
                )}
                disabled={field.disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fieldValue ? format(new Date(fieldValue), "PPP") : field.placeholder || "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fieldValue ? new Date(fieldValue) : undefined}
                onSelect={(date) => onFieldChange(rowIndex, field.name, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
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
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

const DynamicRowsField: React.FC<DynamicRowsFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  const dynamicRowsConfig = field.dynamicRowsConfig;
  
  if (!dynamicRowsConfig) {
    return <div>Dynamic rows configuration is missing</div>;
  }
  
  // Initialize rows with default values or empty array
  const [rows, setRows] = useState<any[]>(() => {
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
    
    // Initialize with minimum number of rows if specified
    if (dynamicRowsConfig.minRows && dynamicRowsConfig.minRows > 0) {
      return Array(dynamicRowsConfig.minRows).fill(dynamicRowsConfig.defaultRowValues || {});
    }
    
    return [];
  });

  // Update parent form when rows change
  useEffect(() => {
    onChange(rows);
  }, [rows, onChange]);

  // Handle adding a new row
  const handleAddRow = useCallback(() => {
    const maxRows = dynamicRowsConfig.maxRows || Infinity;
    
    if (rows.length < maxRows) {
      setRows((prevRows) => [
        ...prevRows, 
        { ...dynamicRowsConfig.defaultRowValues, _id: `row-${Date.now()}` }
      ]);
    }
  }, [rows.length, dynamicRowsConfig.maxRows, dynamicRowsConfig.defaultRowValues]);

  // Handle deleting a row
  const handleDeleteRow = useCallback((rowIndex: number) => {
    const minRows = dynamicRowsConfig.minRows || 0;
    
    if (rows.length > minRows) {
      setRows((prevRows) => prevRows.filter((_, index) => index !== rowIndex));
    }
  }, [rows.length, dynamicRowsConfig.minRows]);

  // Handle field value changes
  const handleFieldChange = useCallback((rowIndex: number, fieldName: string, fieldValue: any) => {
    setRows((prevRows) => 
      prevRows.map((row, index) => 
        index === rowIndex ? { ...row, [fieldName]: fieldValue } : row
      )
    );
  }, []);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = rows.findIndex(row => row._id === active.id);
      const newIndex = rows.findIndex(row => row._id === over.id);
      
      setRows((prevRows) => {
        const newRows = [...prevRows];
        const [movedRow] = newRows.splice(oldIndex, 1);
        newRows.splice(newIndex, 0, movedRow);
        return newRows;
      });
    }
  }, [rows]);

  // Generate row IDs for sortable context
  const rowIds = rows.map(row => row._id || `row-${Math.random()}`);
  
  // Check if delete button should be disabled
  const isDeleteDisabled = rows.length <= (dynamicRowsConfig.minRows || 0);
  
  // Check if add button should be disabled
  const isAddDisabled = dynamicRowsConfig.maxRows ? rows.length >= dynamicRowsConfig.maxRows : false;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {dynamicRowsConfig.sortable ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
              {rows.map((row, index) => (
                <SortableRow
                  key={row._id || index}
                  id={row._id || `row-${index}`}
                  rowIndex={index}
                  rowData={row}
                  fields={dynamicRowsConfig.fields}
                  onFieldChange={handleFieldChange}
                  onDeleteRow={handleDeleteRow}
                  isDeleteDisabled={isDeleteDisabled}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          // Non-sortable version
          <div className="space-y-2">
            {rows.map((row, index) => (
              <div 
                key={row._id || index}
                className="flex items-start gap-4 p-4 border rounded-md mb-2 bg-background"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dynamicRowsConfig.fields.map((fieldConfig) => (
                    <div key={fieldConfig.name} className="flex flex-col space-y-1.5">
                      {fieldConfig.type !== 'checkbox' && (
                        <Label htmlFor={`${fieldConfig.name}-${index}`}>
                          {fieldConfig.label}
                          {fieldConfig.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                      )}
                      {/* Render field based on type (simplified version of the sortable row) */}
                      {/* This is a simplified version - in a real implementation, you'd want to extract this to a shared function */}
                      <Input
                        id={`${fieldConfig.name}-${index}`}
                        name={fieldConfig.name}
                        value={row[fieldConfig.name] || ""}
                        onChange={(e) => handleFieldChange(index, fieldConfig.name, e.target.value)}
                        className={cn(fieldConfig.width ? fieldConfig.width : "w-full")}
                      />
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRow(index)}
                  disabled={isDeleteDisabled}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddRow}
        disabled={isAddDisabled}
        className="mt-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        {dynamicRowsConfig.addRowButtonText || "Add Row"}
      </Button>
      
      {error && touched && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default memo(DynamicRowsField);