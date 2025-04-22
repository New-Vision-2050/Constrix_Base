"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ReactHookSheetFormBuilder,
  FormConfig,
} from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

// Define a sample form configuration
const reactHookFormConfig: FormConfig = {
  formId: "react-hook-form-example",
  title: "React Hook Form Example",
  description: "This form is implemented using React Hook Form",
  sections: [
    {
      title: "Personal Information",
      description: "Please enter your personal details",
      fields: [
        {
          type: "text",
          name: "firstName",
          label: "First Name",
          placeholder: "Enter your first name",
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
          placeholder: "Enter your last name",
          required: true,
          validation: [
            {
              type: "required",
              message: "Last name is required",
            },
            {
              type: "minLength",
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          ],
        },
        {
          type: "email",
          name: "email",
          label: "Email Address",
          placeholder: "Enter your email address",
          required: true,
          validation: [
            {
              type: "required",
              message: "Email is required",
            },
            {
              type: "email",
              message: "Please enter a valid email address",
            },
          ],
        },
        {
          type: "phone",
          name: "phone",
          label: "Phone Number",
          placeholder: "Enter your phone number",
        },
      ],
    },
    {
      title: "Address Information",
      description: "Please enter your address details",
      fields: [
        {
          type: "text",
          name: "address",
          label: "Street Address",
          placeholder: "Enter your street address",
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
          placeholder: "Enter your city",
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
          placeholder: "Select your country",
          required: true,
          dynamicOptions: {
            url: `${baseURL}/countries`,
            valueField: "id",
            labelField: "name",
            searchParam: "name",
            paginationEnabled: true,
            pageParam: "page",
            limitParam: "per_page",
            itemsPerPage: 10,
            totalCountHeader: "X-Total-Count",
          },
          validation: [
            {
              type: "required",
              message: "Country is required",
            },
          ],
        },
        {
          type: "checkbox",
          name: "mailingList",
          label: "Subscribe to mailing list",
        },
      ],
    },
  ],
  submitButtonText: "Submit Form",
  cancelButtonText: "Cancel",
  showReset: true,
  resetButtonText: "Reset Form",
  showSubmitLoader: true,
  resetOnSuccess: true,
  
  // Enable wizard mode
  wizard: true,
  wizardOptions: {
    showStepIndicator: true,
    showStepTitles: true,
    validateStepBeforeNext: true,
    allowStepNavigation: true,
    nextButtonText: "Next",
    prevButtonText: "Previous",
    finishButtonText: "Submit",
  },
  
  // Example onSuccess handler
  onSuccess: (values, result) => {
    console.log("Form submitted successfully with values:", values);
    console.log("Result from API:", result);
  },
  
  // Example onError handler
  onError: (values, error) => {
    console.log("Form submission failed with values:", values);
    console.log("Error details:", error);
  },
};

export default function ReactHookFormExamplePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">React Hook Form Example</h1>
      <p className="mb-6">
        This example demonstrates how to use React Hook Form with the form builder components.
      </p>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sheet Form Example</h2>
        <ReactHookSheetFormBuilder
          config={reactHookFormConfig}
          trigger={<Button>Open Form in Sheet</Button>}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Form validation using Zod schema</li>
          <li>Field-level validation</li>
          <li>Multi-step form support</li>
          <li>Form state management with React Hook Form</li>
          <li>API validation support</li>
          <li>Conditional fields</li>
          <li>Custom field renderers</li>
        </ul>
      </div>
    </div>
  );
}