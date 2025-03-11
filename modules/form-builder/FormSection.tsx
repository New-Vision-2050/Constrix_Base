
import React, {memo} from 'react';
import { FormSection as FormSectionType } from './types/formTypes';
import FormField from './FormField';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/modules/table/components/ui/card';

interface FormSectionProps {
  section: FormSectionType;
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  values,
  errors,
  touched,
}) => {
  // Create the grid template columns based on the number of columns
  const gridStyle = section.columns
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))`,
        gap: '1rem',
      }
    : {};

  return (
    <Card className={cn(section.className)}>
      {(section.title || section.description) && (
        <CardHeader>
          {section.title && <CardTitle>{section.title}</CardTitle>}
          {section.description && <CardDescription>{section.description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        <div style={gridStyle}>
          {section.fields.map((field) => {
            // Skip rendering if the field should be hidden
            if (field.condition && !field.condition(values)) {
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
                  value={values[field.name]}
                  error={errors[field.name]}
                  touched={touched[field.name]}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(FormSection);
