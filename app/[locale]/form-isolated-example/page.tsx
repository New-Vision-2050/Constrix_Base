"use client";
import React from "react";
import {
  FormConfig,
  useFormData,
  useFormReload,
} from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

// Example form configuration
const formConfig: FormConfig = {
  title: "Isolated Form Example",
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
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          validation: [
            {
              type: "min",
              value: 18,
              message: "You must be at least 18 years old"
            }
          ]
        },
        {
          name: "bio",
          label: "Bio",
          type: "textarea",
        },
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

export default function FormIsolatedExamplePage() {
  // Define unique form ID
  const formId = "isolated-form-example";

  // Use the form data hook
  const form = useFormData({
    config: formConfig,
    formId,
    onSuccess: (values) => {
      console.log("Form submitted successfully:", values);
      alert("Form submitted successfully!");
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      alert(`Form submission error: ${error}`);
    }
  });

  // Use the form reload hook
  const { reloadForm } = useFormReload();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Isolated Form Example</h1>
      <p className="text-gray-600">
        This example demonstrates the use of the isolated form module with the useFormData hook.
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
                  onChange={(e) => {
                    const value = field.type === 'number'
                      ? e.target.value === '' ? '' : Number(e.target.value)
                      : e.target.value;
                    form.handleFieldChange(field.name, value, field.validation);
                  }}
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

      <div className="bg-gray-100 p-6 rounded-lg">
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

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => reloadForm(formId)}
        >
          Reload Form
        </Button>
      </div>
    </div>
  );
}
