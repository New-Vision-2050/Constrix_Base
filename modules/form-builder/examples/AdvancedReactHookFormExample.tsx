"use client";

import React from "react";
import { ReactHookSheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

const AdvancedReactHookFormExample: React.FC = () => {
  // Define the form configuration with advanced features
  const formConfig: FormConfig = {
    title: "Advanced React Hook Form Example",
    description: "This example demonstrates advanced features of the React Hook Form integration",
    
    // Enable wizard mode for multi-step form
    wizard: true,
    wizardOptions: {
      showStepIndicator: true,
      showStepTitles: true,
      validateStepBeforeNext: true,
      nextButtonText: "Continue",
      prevButtonText: "Previous",
      finishButtonText: "Complete Registration",
      // Optional: Submit each step individually
      submitEachStep: true,
      onStepSubmit: async (step, values) => {
        console.log(`Step ${step + 1} submitted:`, values);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
          success: true,
          message: `Step ${step + 1} saved successfully`,
          // Return data that can be used in subsequent steps
          data: {
            ...(step === 0 ? { userId: "user-123" } : {}),
            ...(step === 1 ? { addressId: "addr-456" } : {})
          }
        };
      }
    },
    
    // Form sections (each section becomes a step in wizard mode)
    sections: [
      {
        title: "Personal Information",
        description: "Enter your basic information",
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
              {
                type: "minLength",
                value: 2,
                message: "First name must be at least 2 characters",
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
              {
                type: "apiValidation",
                message: "This email is already registered",
                apiConfig: {
                  url: "/api/validate-email",
                  method: "POST",
                  debounceMs: 500,
                  paramName: "email",
                  // This would be implemented in a real application
                  // successCondition: (response) => response.available === true,
                },
              },
            ],
          },
          {
            type: "select",
            name: "userType",
            label: "User Type",
            options: [
              { value: "individual", label: "Individual" },
              { value: "company", label: "Company" },
            ],
            required: true,
            validation: [
              {
                type: "required",
                message: "Please select a user type",
              },
            ],
          },
          {
            type: "text",
            name: "companyName",
            label: "Company Name",
            required: true,
            // Conditional field - only shown when userType is 'company'
            condition: (values) => values.userType === "company",
            validation: [
              {
                type: "required",
                message: "Company name is required",
              },
            ],
          },
        ],
      },
      {
        title: "Address Information",
        description: "Enter your address details",
        fields: [
          {
            type: "text",
            name: "address1",
            label: "Address Line 1",
            required: true,
            validation: [
              {
                type: "required",
                message: "Address is required",
              },
            ],
          },
          {
            type: "text",
            name: "address2",
            label: "Address Line 2",
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
            options: [
              { value: "us", label: "United States" },
              { value: "ca", label: "Canada" },
              { value: "uk", label: "United Kingdom" },
              { value: "au", label: "Australia" },
            ],
            required: true,
            validation: [
              {
                type: "required",
                message: "Country is required",
              },
            ],
          },
          {
            type: "select",
            name: "state",
            label: "State/Province",
            // Dynamic options based on country selection
            dynamicOptions: {
              url: "/api/states",
              valueField: "code",
              labelField: "name",
              dependsOn: "country",
              // This would be implemented in a real application
              // transformResponse: (data) => data.states.map(s => ({ value: s.code, label: s.name })),
            },
            // Only show when country is US or Canada
            condition: (values) => ["us", "ca"].includes(values.country),
            required: true,
            validation: [
              {
                type: "required",
                message: "State/Province is required",
              },
            ],
          },
          {
            type: "text",
            name: "postalCode",
            label: "Postal Code",
            required: true,
            validation: [
              {
                type: "required",
                message: "Postal code is required",
              },
              {
                type: "pattern",
                value: (values: Record<string, any>) => {
                  // Different regex pattern based on country
                  if (values.country === "us") {
                    return "^\\d{5}(-\\d{4})?$"; // US ZIP code
                  } else if (values.country === "ca") {
                    return "^[A-Za-z]\\d[A-Za-z] \\d[A-Za-z]\\d$"; // Canadian postal code
                  }
                  return ".*"; // Any pattern for other countries
                },
                message: "Please enter a valid postal code",
              },
            ],
          },
        ],
      },
      {
        title: "Profile Settings",
        description: "Set up your profile preferences",
        fields: [
          {
            type: "image",
            name: "profileImage",
            label: "Profile Image",
            imageConfig: {
              allowedFileTypes: ["image/jpeg", "image/png"],
              maxFileSize: 5 * 1024 * 1024, // 5MB
              previewWidth: 200,
              previewHeight: 200,
            },
          },
          {
            type: "checkbox",
            name: "receiveNotifications",
            label: "Receive Email Notifications",
          },
          {
            type: "checkbox",
            name: "agreeToTerms",
            label: "I agree to the Terms and Conditions",
            required: true,
            validation: [
              {
                type: "required",
                message: "You must agree to the terms and conditions",
              },
            ],
          },
          {
            type: "dynamicRows",
            name: "contacts",
            label: "Emergency Contacts",
            dynamicRowOptions: {
              rowFields: [
                {
                  type: "text",
                  name: "name",
                  label: "Contact Name",
                  required: true,
                  validation: [
                    {
                      type: "required",
                      message: "Contact name is required",
                    },
                  ],
                },
                {
                  type: "text",
                  name: "relationship",
                  label: "Relationship",
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
              minRows: 1,
              maxRows: 3,
            },
          },
        ],
      },
    ],
    
    // Initial values
    initialValues: {
      userType: "individual",
      receiveNotifications: true,
      contacts: [{ name: "", relationship: "", phone: "" }],
    },
    
    // Form submission handler
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: "Registration completed successfully!",
      };
    },
    
    // Event handlers
    onSuccess: (values, result) => {
      console.log("Form submitted successfully:", values);
      alert(result.message);
    },
    onError: (values, error) => {
      console.error("Form submission error:", error);
      alert(`Error: ${error.message}`);
    },
    onValidationError: (errors) => {
      console.error("Validation errors:", errors);
    },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Advanced React Hook Form Example</h1>
      
      <ReactHookSheetFormBuilder
        config={formConfig}
        trigger={<Button>Open Registration Form</Button>}
        onSuccess={(values: Record<string, any>) => {
          console.log("Form submitted successfully:", values);
        }}
      />
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            This example demonstrates a multi-step form using React Hook Form integration.
          </li>
          <li>
            It includes conditional fields, dynamic dropdowns, and complex validation rules.
          </li>
          <li>
            Each step can be submitted individually with the <code>submitEachStep</code> option.
          </li>
          <li>
            The form uses Zod validation schema generated automatically from the form configuration.
          </li>
          <li>
            API validation is demonstrated with the email field (simulated).
          </li>
          <li>
            Dynamic rows are used for the emergency contacts section.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedReactHookFormExample;