"use client";
import React from "react";
import { 
  FormConfig, 
  useFormData,
  SheetFormBuilder
} from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

// Example form configuration with formId
const formConfig: FormConfig = {
  formId: "example-form-with-id", // This formId will be used by all hooks
  title: "Form with Config ID Example",
  submitButtonText: "حفظ",
  resetOnSuccess: true,
  sections: [
    {
      title: "User Information",
      fields: [
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
          validation: [
            {
              type: "required",
              message: "الاسم مطلوب"
            },
            {
              type: "minLength",
              value: 3,
              message: "Name must be at least 3 characters"
            }
          ]
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          validation: [
            {
              type: "required",
              message: "البريد الالكترونى مطلوب"
            },
            {
              type: "email",
              message: "Please enter a valid email address"
            }
          ]
        }
      ],
    },
  ],
  // This would be your actual API endpoint for form submission
  onSubmit: async (formData: Record<string, unknown>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Log the form data
    console.log("Form data received:", formData);
    
    // Return success response
    return {
      success: true,
      message: "Form submitted successfully",
    };
  },
};

export default function FormConfigIdExamplePage() {
  // Use the form data hook - no need to pass formId as it's in the config
  const form = useFormData({
    config: formConfig,
    // formId is optional here since it's in the config
    onSuccess: (values) => {
      console.log("Form submitted successfully:", values);
      alert("Form submitted successfully!");
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      alert(`Form submission error: ${error}`);
    }
  });
  
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Form with Config ID Example</h1>
      <p className="text-gray-600">
        This example demonstrates using a formId in the FormConfig object.
        The formId in the config is used by all hooks, making it easier to maintain.
      </p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{formConfig.title}</h2>
        
        <form onSubmit={(e) => form.handleSubmit(e)}>
          {form.getVisibleFields(form.values).map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium mb-1">
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
                  onChange={(e) => form.handleFieldChange(field.name, e.target.value, field.validation)}
                />
              )}
              
              {form.errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {form.errors[field.name]}
                </p>
              )}
            </div>
          ))}
          
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
              {form.isSubmitting ? 'جاري الحفظ' : formConfig.submitButtonText}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Using with SheetFormBuilder</h2>
        <p className="text-gray-600 mb-4">
          The SheetFormBuilder component also uses the formId from the config:
        </p>
        
        <SheetFormBuilder
          config={formConfig}
          // No need to pass formId here as it's in the config
          trigger={<Button>Open Form in Sheet</Button>}
          onSuccess={(data) => {
            console.log("Form submitted successfully:", data);
            alert("Form submitted successfully from sheet!");
          }}
        />
      </div>
      
      <div className="bg-gray-100 p-6 rounded-lg mt-8">
        <h2 className="text-xl font-semibold mb-4">Form State</h2>
        <div className="grid grid-cols-2 gap-4">
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
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Form Status</h3>
          <div className="bg-white p-3 rounded">
            <p><strong>Form ID:</strong> {form.formId}</p>
            <p><strong>Is Valid:</strong> {form.isValid ? 'Yes' : 'No'}</p>
            <p><strong>Is Submitting:</strong> {form.isSubmitting ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
