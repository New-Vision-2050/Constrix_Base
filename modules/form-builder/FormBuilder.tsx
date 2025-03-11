
import React, {memo, useEffect} from 'react';
import { FormConfig } from './types/formTypes';
import { useFormBuilder } from '@/modules/form-builder/hooks/useFormBuilder';
import FormSection from './FormSection';
import { Button } from '@/modules/table/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/modules/table/hooks//use-toast';

interface FormBuilderProps {
  config: FormConfig;
  className?: string;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ config, className }) => {
  const { toast } = useToast();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    handleSubmit,
    handleReset,
    handleCancel,
    shouldDisplaySection,
    handleLaravelValidationErrors,
  } = useFormBuilder({
    ...config,
    onValidationError: (validationErrors) => {
      console.log('Validation errors in FormBuilder:', validationErrors);

      // Show the first validation error as a toast
      const firstError = Object.values(validationErrors)[0];
      if (firstError) {
        toast({
          title: "Validation Error",
          description: firstError,
          variant: "destructive",
        });
      }

      if (config.onValidationError) {
        config.onValidationError(validationErrors);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn("space-y-6", className, config.className)}
      >
        {config.title && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{config.title}</h2>
            {config.description && (
              <p className="text-muted-foreground">{config.description}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Render form sections */}
          {config.sections.map((section, index) => (
            shouldDisplaySection(section.condition) && (
              <FormSection
                key={`${section.title || index}-${submitCount}`}
                section={section}
                values={values}
                errors={errors}
                touched={touched}
              />
            )
          ))}

          {/* Form actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {config.showReset && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                {config.resetButtonText || "Reset"}
              </Button>
            )}

            {config.cancelButtonText && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                {config.cancelButtonText}
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting && config.showSubmitLoader && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {config.submitButtonText || "Submit"}
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(FormBuilder);
