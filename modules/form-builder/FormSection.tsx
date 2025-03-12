import React, { memo, useMemo, useCallback } from 'react';
import { FormSection as FormSectionType } from './types/formTypes';
import FormField from './FormField';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/modules/table/components/ui/card';
import { useFormStore } from './store/useFormStore';

interface FormSectionProps {
  section: FormSectionType;
  submitCount: number; // Used for key generation only
}

// Create a field component that manages its own state
const FormFieldContainer = memo(({ field }: { field: any }) => {
  // Each field container gets its own value, error, and touched state
  const value = useFormStore(state => state.values[field.name]);
  const error = useFormStore(state => state.errors[field.name]);
  const touched = useFormStore(state => state.touched[field.name]);
  
  // Get values directly without subscribing for condition check
  const shouldRender = useCallback(() => {
    if (!field.condition) return true;
    
    // Get values directly from the store without subscribing
    const values = useFormStore.getState().values;
    return field.condition(values);
  }, [field.condition]);
  
  // Check if field should be rendered
  if (!shouldRender()) {
    return null;
  }

  // Field-specific styling for width, grid area, etc.
  const fieldStyle: React.CSSProperties = {};

  if (field.width) {
    fieldStyle.width = field.width;
  }

  if (field.gridArea) {
    fieldStyle.gridArea = field.gridArea;
  }

  return (
    <div key={field.name} style={fieldStyle}>
      <FormField
        field={field}
        value={value}
        error={error}
        touched={touched}
      />
    </div>
  );
});
console.log('asdasda22')
// Create a component that checks if section should be displayed
// This component doesn't subscribe to any store values
const SectionVisibilityChecker = memo(({ 
  section, 
  children 
}: { 
  section: FormSectionType; 
  children: React.ReactNode;
}) => {
  // Function to check if section should be displayed
  const shouldDisplaySection = useCallback(() => {
    if (!section.condition) return true;
    
    // Get values directly from the store without subscribing
    const values = useFormStore.getState().values;
    return section.condition(values);
  }, [section.condition]);
  
  // Check if section should be displayed
  if (!shouldDisplaySection()) {
    return null;
  }
  
  return <>{children}</>;
});

const FormSection: React.FC<FormSectionProps> = ({
  section,
  submitCount,
}) => {
  // Memoize the grid style to prevent recalculation on every render
  const gridStyle = useMemo(() => {
    return section.columns
      ? {
          display: 'grid',
          gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))`,
          gap: '1rem',
        }
      : {};
  }, [section.columns]);

  // Use the SectionVisibilityChecker to determine if section should be displayed
  return (
    <SectionVisibilityChecker section={section}>
      <Card className={cn(section.className)}>
        {(section.title || section.description) && (
          <CardHeader>
            {section.title && <CardTitle>{section.title}</CardTitle>}
            {section.description && <CardDescription>{section.description}</CardDescription>}
          </CardHeader>
        )}

        <CardContent>
          <div style={gridStyle}>
            {section.fields.map((field) => (
              <FormFieldContainer 
                key={`${field.name}-${submitCount}`} 
                field={field} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </SectionVisibilityChecker>
  );
};

export default memo(FormSection);
