"use client";

import { SheetFormBuilder, type FormConfig } from "@/modules/form-builder";

interface FormValues {
  // Step 1
  firstName: string;
  lastName: string;
  // Step 2
  email: string;
  phone: string;
  // Step 3
  street: string;
  city: string;
  country: string;
}

const formConfig: FormConfig = {
  // Enable wizard mode for multi-step form
  wizard: true,
  wizardOptions: {
    showStepIndicator: true,
    showStepTitles: true,
    validateStepBeforeNext: true,
    nextButtonText: "Next",
    prevButtonText: "Back",
    finishButtonText: "Submit",
  },
  sections: [
    // Step 1: Personal Information
    {
      title: "Personal Information",
      fields: [
        {
          type: "text",
          name: "firstName",
          label: "First Name",
          required: true,
          validation: [
            {
              type: "required",
              message: "First name is required",
            },
          ],
        },
        {
          type: "text",
          name: "lastName",
          label: "Last Name",
          required: true,
          validation: [
            {
              type: "required",
              message: "Last name is required",
            },
          ],
        },
      ],
    },
    // Step 2: Contact Information
    {
      title: "Contact Information",
      fields: [
        {
          type: "email",
          name: "email",
          label: "Email Address",
          required: true,
          validation: [
            {
              type: "required",
              message: "Email is required",
            },
            {
              type: "email",
              message: "Please enter a valid email",
            },
          ],
        },
        {
          type: "phone",
          name: "phone",
          label: "Phone Number",
          required: true,
          validation: [
            {
              type: "required",
              message: "Phone number is required",
            },
          ],
        },
      ],
    },
    // Step 3: Address
    {
      title: "Address",
      fields: [
        {
          type: "text",
          name: "street",
          label: "Street Address",
          required: true,
          validation: [
            {
              type: "required",
              message: "Street address is required",
            },
          ],
        },
        {
          type: "text",
          name: "city",
          label: "City",
          required: true,
          validation: [
            {
              type: "required",
              message: "City is required",
            },
          ],
        },
        {
          type: "select",
          name: "country",
          label: "Country",
          required: true,
          options: [
            { value: "us", label: "United States" },
            { value: "ca", label: "Canada" },
            { value: "uk", label: "United Kingdom" },
          ],
          validation: [
            {
              type: "required",
              message: "Country is required",
            },
          ],
        },
      ],
    },
  ],
  // Handle form submission
  onSubmit: async (values: Record<string, unknown>) => {
    console.log("All form values:", values);
    // Here you would typically send the data to your API
    return { success: true, message: "Form submitted successfully" };
  },
};

export default function StepFormExample() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Multi-step Form Example</h1>
      <SheetFormBuilder
        config={formConfig}
        onSuccess={(values) => {
          // Cast the values to our FormValues type
          const formValues = values as FormValues;
          
          // Process form values
          const fullName = `${formValues.firstName} ${formValues.lastName}`;
          const contactInfo = `${formValues.email} (${formValues.phone})`;
          const address = `${formValues.street}, ${formValues.city}, ${formValues.country}`;
          
          // Use the processed values
          console.log('Full Name:', fullName);
          console.log('Contact:', contactInfo);
          console.log('Address:', address);
        }}
      />
    </div>
  );
}