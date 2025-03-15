# Form Builder Module

The Form Builder module provides a flexible and powerful way to create forms in your application. It supports both simple forms and complex multi-step wizard forms with multiple sections per step.

## Key Features

- **Simple Forms**: Create basic forms with a single section
- **Wizard Forms**: Create multi-step forms with navigation between steps
- **Multi-Section Steps**: Group related fields into multiple sections within each step
- **Step-by-Step Submission**: Submit each step to different API endpoints
- **Validation**: Validate fields before proceeding to the next step
- **Conditional Fields**: Show/hide fields based on other field values
- **Dynamic Dropdowns**: Load dropdown options from API endpoints
- **Responsive Design**: Works on all screen sizes

## Components

### SheetFormBuilder

The main component that renders a form in a slide-in sheet. It supports both simple forms and wizard forms.

```tsx
import SheetFormBuilder from '@/modules/form-builder/components/SheetFormBuilder';
import { wizardSheetFormConfig } from '@/modules/form-builder/configs/wizardSheetFormConfig';

// Basic usage
<SheetFormBuilder config={wizardSheetFormConfig} />

// With custom trigger
<SheetFormBuilder 
  config={wizardSheetFormConfig}
  trigger={<Button>Open Form</Button>}
  onSuccess={(values) => console.log('Form submitted:', values)}
  onCancel={() => console.log('Form cancelled')}
/>
```

### ExpandableFormSection

Renders a collapsible section of form fields. Used internally by SheetFormBuilder.

## Configuration

### Form Configuration

The form configuration is defined using the `FormConfig` interface. It includes:

- **Basic Information**: Title, description, etc.
- **Sections**: Form sections containing fields
- **API Configuration**: URL and headers for form submission
- **Wizard Options**: Configuration for multi-step forms
- **Button Text**: Text for submit, cancel, and reset buttons
- **Callbacks**: Functions to handle form events

### Wizard Form with Multiple Sections Per Step

The `wizardSheetFormConfig.ts` file demonstrates how to create a wizard form with multiple sections per step. Each step can have its own API endpoint, headers, and handlers.

```typescript
// Define wizard steps with multiple sections per step
const wizardSteps: WizardStep[] = [
  // Step 1: Location Information (contains multiple sections)
  {
    title: 'Location Information',
    description: 'Tell us where you are located',
    
    // Step-specific API configuration
    apiUrl: 'https://api.example.com/locations',
    apiHeaders: {
      'X-Location-API-Key': 'location-api-key',
      'Content-Type': 'application/json'
    },
    
    // Step-specific handlers
    onSubmit: async (step, values) => {
      console.log(`Submitting location information (step ${step + 1})`);
      // Handle step submission
      return {
        success: true,
        message: 'Location information saved successfully',
        data: {
          locationId: 'LOC-12345',
          locationName: 'New York, USA'
        }
      };
    },
    
    onChange: (prevStep, nextStep, values) => {
      console.log(`Moving from step ${prevStep + 1} to step ${nextStep + 1}`);
      // Handle step change
    },
    
    sections: [
      // Section 1: Address Information
      {
        title: 'Address Information',
        description: 'Enter your address details',
        fields: [
          // Fields for this section
        ]
      },
      // Section 2: Additional Location Details
      {
        title: 'Additional Location Details',
        description: 'Provide more information about your location',
        fields: [
          // Fields for this section
        ]
      }
    ]
  },
  // Additional steps...
];

// Form configuration
export const wizardSheetFormConfig: FormConfig = {
  // Basic form configuration
  title: 'Multi-Section Wizard Form',
  description: 'Complete all steps to submit your information',
  
  // Enable wizard mode
  wizard: true,
  
  // Define wizard steps with multiple sections per step
  wizardSteps: wizardSteps,
  
  // Wizard options
  wizardOptions: {
    // Step indicator options
    showStepIndicator: true,
    showStepTitles: true,
    
    // Validation options
    validateStepBeforeNext: true,
    
    // Navigation options
    allowStepNavigation: true,
    nextButtonText: 'Continue',
    prevButtonText: 'Back',
    finishButtonText: 'Submit Form',
    
    // Step submission options
    submitEachStep: true,
    submitButtonTextPerStep: 'Save & Continue'
  },
  
  // Form submission handlers
  onSuccess: (values, result) => {
    // Handle form submission success
  },
  
  onError: (values, error) => {
    // Handle form submission error
  }
};
```

### Step-Specific vs. Global Configuration

You can configure API endpoints and handlers in two ways:

1. **Step-Specific Configuration**: Define API URLs, headers, and handlers directly on each step
   ```typescript
   {
     title: 'Step Title',
     apiUrl: 'https://api.example.com/endpoint',
     apiHeaders: { 'X-API-Key': 'api-key' },
     onSubmit: async (step, values) => { /* handle submission */ },
     onChange: (prevStep, nextStep, values) => { /* handle change */ },
     sections: [/* sections */]
   }
   ```

2. **Global Configuration**: Define API URLs, headers, and handlers in the wizardOptions
   ```typescript
   wizardOptions: {
     stepApiUrls: { 0: 'https://api.example.com/endpoint' },
     stepApiHeaders: { 0: { 'X-API-Key': 'api-key' } },
     onStepSubmit: async (step, values) => { /* handle submission */ },
     onStepChange: (prevStep, nextStep, values) => { /* handle change */ }
   }
   ```

The system prioritizes step-specific configuration over global configuration. This means:

- If a step has its own `apiUrl`, it will be used instead of `wizardOptions.stepApiUrls[step]`
- If a step has its own `apiHeaders`, they will be used instead of `wizardOptions.stepApiHeaders[step]`
- If a step has its own `onSubmit` handler, it will be called instead of `wizardOptions.onStepSubmit`
- If a step has its own `onChange` handler, it will be called instead of `wizardOptions.onStepChange`

## Examples

Check out the `examples` directory for sample implementations:

- `WizardSheetFormExample.tsx`: Demonstrates a wizard form with multiple sections per step

## Usage Guidelines

### Creating a Multi-Section Wizard Form

1. Define your wizard steps with multiple sections per step
2. Configure API endpoints and handlers for each step (either step-specific or global)
3. Implement step submission handlers
4. Use the SheetFormBuilder component with your configuration

### Best Practices

- Group related fields into sections for better organization
- Use clear and descriptive titles for steps and sections
- Validate fields before proceeding to the next step
- Provide feedback to users after each step submission
- Use conditional fields to simplify the form based on user input
- Consider using dynamic dropdowns for fields with many options
- Use step-specific API configuration and handlers for more granular control
- Store step response data to use in subsequent steps