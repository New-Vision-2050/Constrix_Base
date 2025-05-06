import React from 'react';
import { SheetFormBuilder, FormConfig } from '@/modules/form-builder';

const CheckboxGroupExample: React.FC = () => {
  // Form configuration with checkbox group examples
  const formConfig: FormConfig = {
    title: "Checkbox Group Examples",
    sections: [
      {
        title: "Single Select Checkbox Group",
        description: "This checkbox group allows only one option to be selected (radio-like behavior)",
        fields: [
          {
            type: "checkboxGroup",
            name: "favoriteColor",
            label: "Favorite Color",
            isMulti: false, // Single select mode
            required: true,
            options: [
              { value: "red", label: "Red" },
              { value: "green", label: "Green" },
              { value: "blue", label: "Blue" },
              { value: "yellow", label: "Yellow" },
            ],
            validation: [
              {
                type: "required",
                message: "Please select your favorite color",
              },
            ],
          },
        ],
      },
      {
        title: "Multi Select Checkbox Group",
        description: "This checkbox group allows multiple options to be selected",
        fields: [
          {
            type: "checkboxGroup",
            name: "hobbies",
            label: "Hobbies",
            isMulti: true, // Multi select mode
            required: true,
            options: [
              { value: "reading", label: "Reading" },
              { value: "sports", label: "Sports" },
              { value: "music", label: "Music" },
              { value: "cooking", label: "Cooking" },
              { value: "gaming", label: "Gaming" },
              { value: "traveling", label: "Traveling" },
            ],
            validation: [
              {
                type: "required",
                message: "Please select at least one hobby",
              },
            ],
          },
        ],
      },
      {
        title: "Conditional Fields with Checkbox Group",
        description: "This example shows how to use checkbox groups with conditional fields",
        fields: [
          {
            type: "checkboxGroup",
            name: "programmingLanguages",
            label: "Programming Languages",
            isMulti: true,
            options: [
              { value: "javascript", label: "JavaScript" },
              { value: "python", label: "Python" },
              { value: "java", label: "Java" },
              { value: "csharp", label: "C#" },
              { value: "ruby", label: "Ruby" },
            ],
          },
          {
            type: "text",
            name: "javascriptExperience",
            label: "JavaScript Experience (years)",
            condition: (values) => {
              const languages = Array.isArray(values.programmingLanguages) 
                ? values.programmingLanguages 
                : [values.programmingLanguages];
              return languages.includes("javascript");
            },
          },
          {
            type: "text",
            name: "pythonExperience",
            label: "Python Experience (years)",
            condition: (values) => {
              const languages = Array.isArray(values.programmingLanguages) 
                ? values.programmingLanguages 
                : [values.programmingLanguages];
              return languages.includes("python");
            },
          },
        ],
      },
    ],
    onSubmit: async (values) => {
      console.log("Form values:", values);
      return { success: true, message: "Form submitted successfully" };
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkbox Group Field Examples</h1>
      <SheetFormBuilder
        config={formConfig}
        onSuccess={(values: Record<string, any>) => console.log("Success:", values)}
      />
    </div>
  );
};

export default CheckboxGroupExample;