import React, { memo, useCallback, useMemo } from 'react';
import { FormConfig } from './types/formTypes';
import { useFormBuilder } from '@/modules/form-builder/hooks/useFormBuilder';
import FormSection from './FormSection';
import { Button } from '@/modules/table/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/modules/table/hooks//use-toast';
import { useFormStore } from './store/useFormStore';

interface FormBuilderProps {
  config: FormConfig;
  className?: string;
}

// Create a component that only listens to submission state
const FormActions = memo(({ 
  config, 
  handleReset, 
  handleCancel, 
  handleSubmit 
}: { 
  config: FormConfig; 
  handleReset: () => void; 
  handleCancel: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => {
  // Only subscribe to isSubmitting state
  const isSubmitting = useFormStore(state => state.isSubmitting);
  
  return (
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
  );
});

// Create a component that renders sections and only listens to submitCount
const FormSections = memo(({ 
  config, 
  submitCount 
}: { 
  config: FormConfig; 
  submitCount: number;
}) => {
  return (
    <>
      {config.sections.map((section, index) => (
        <FormSection
          key={`${section.title || index}-${submitCount}`}
          section={section}
          submitCount={submitCount}
        />
      ))}
    </>
  );
});

const FormBuilder: React.FC<FormBuilderProps> = ({ config, className }) => {
  const { toast } = useToast();

  // Memoize the validation error handler to prevent recreating it on every render
  const handleValidationError = useCallback((validationErrors: Record<string, string>) => {
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
  }, [config.onValidationError, toast]);

  // Use the memoized validation error handler
  const formConfig = useMemo(() => ({
    ...config,
    onValidationError: handleValidationError
  }), [config, handleValidationError]);

  // Only get what we need from useFormBuilder
  // We don't need values, errors, touched, or shouldDisplaySection here
  const {
    submitCount,
    handleSubmit,
    handleReset,
    handleCancel,
  } = useFormBuilder(formConfig);

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
          <FormSections config={config} submitCount={submitCount} />

          {/* Form actions */}
          <FormActions 
            config={config} 
            handleReset={handleReset} 
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
          />
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(FormBuilder);
