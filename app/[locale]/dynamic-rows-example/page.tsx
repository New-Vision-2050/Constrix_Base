"use client";

import React from 'react';
import { dynamicRowsExampleConfig, SheetFormBuilder, useFormData } from '@/modules/form-builder';
import { Button } from '@/components/ui/button';

export default function DynamicRowsExamplePage() {
  // Use the form data hook for direct rendering
  const form = useFormData({
    config: dynamicRowsExampleConfig,
    formId: 'dynamic-rows-example',
    onSuccess: (values) => {
      console.log('Form submitted successfully:', values);
      alert('Form submitted successfully!');
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      alert(`Form submission error: ${error}`);
    }
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Dynamic Rows Field Example</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sheet Form Example</h2>
        <p className="mb-4">This example shows the dynamic rows field in a sheet form.</p>
        <SheetFormBuilder
          config={dynamicRowsExampleConfig}
          trigger={<Button>Open Form in Sheet</Button>}
          onSuccess={(values) => {
            console.log('Form submitted successfully:', values);
            alert('Form submitted successfully!');
          }}
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Inline Form Example</h2>
        <p className="mb-4">This example shows the dynamic rows field in an inline form.</p>
        
        <form onSubmit={(e) => form.handleSubmit(e)} className="space-y-6">
          {form.getVisibleFields(form.values).map((field) => {
            if (field.type === 'dynamicRows') {
              return (
                <div key={field.name} className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {/* Render a placeholder for the dynamic rows field */}
                  <div className="p-4 border border-dashed rounded-md bg-gray-50">
                    <p className="text-center text-gray-500">
                      Dynamic rows fields are complex components that require the full form builder to render properly.
                      Please use the Sheet Form example above to see the dynamic rows field in action.
                    </p>
                  </div>
                  
                  {form.errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">{form.errors[field.name]}</p>
                  )}
                </div>
              );
            }
            
            return (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    className="w-full p-2 border rounded"
                    value={form.values[field.name] || ''}
                    onChange={(e) => form.handleFieldChange(field.name, e.target.value, field.validation)}
                  />
                ) : (
                  <input
                    type={field.type}
                    className="w-full p-2 border rounded"
                    value={form.values[field.name] || ''}
                    onChange={(e) => {
                      const value = field.type === 'number'
                        ? e.target.value === '' ? '' : Number(e.target.value)
                        : e.target.value;
                      form.handleFieldChange(field.name, value, field.validation);
                    }}
                  />
                )}
                
                {form.errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{form.errors[field.name]}</p>
                )}
              </div>
            );
          })}
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.handleFormReset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? 'Submitting...' : dynamicRowsExampleConfig.submitButtonText}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Form State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Values</h3>
            <pre className="bg-white p-3 rounded text-sm overflow-auto max-h-60">
              {JSON.stringify(form.values, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Errors</h3>
            <pre className="bg-white p-3 rounded text-sm overflow-auto max-h-60">
              {JSON.stringify(form.errors, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}