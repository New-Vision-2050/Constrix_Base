import { FormConfig } from '../types/formTypes';

/**
 * Example form configuration demonstrating the use of the hiddenObject field type
 * 
 * This example shows how to:
 * 1. Create a form with a hiddenObject field that stores complex data
 * 2. Use the hiddenObject field with both object and array of objects
 * 3. Access the hidden data in form submission
 */
export const hiddenObjectFormExample: FormConfig = {
  title: 'Form with Hidden Object Data',
  description: 'This form demonstrates the use of hidden object fields',
  sections: [
    {
      title: 'User Information',
      fields: [
        {
          type: 'text',
          name: 'name',
          label: 'Name',
          required: true,
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email',
          required: true,
        },
        // Hidden object field storing a single object
        {
          type: 'hiddenObject',
          name: 'userMetadata',
          label: 'User Metadata', // Label is not displayed but used for identification
          defaultValue: {
            registrationSource: 'web',
            userType: 'customer',
            preferences: {
              notifications: true,
              theme: 'light'
            }
          }
        },
        // Hidden object field storing an array of objects
        {
          type: 'hiddenObject',
          name: 'previousOrders',
          label: 'Previous Orders',
          defaultValue: [
            {
              id: '1001',
              date: '2023-01-15',
              total: 125.50,
              items: [
                { productId: 'p1', quantity: 2 },
                { productId: 'p2', quantity: 1 }
              ]
            },
            {
              id: '1002',
              date: '2023-02-20',
              total: 75.25,
              items: [
                { productId: 'p3', quantity: 1 }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Additional Information',
      fields: [
        {
          type: 'textarea',
          name: 'comments',
          label: 'Comments',
        }
      ]
    }
  ],
  // Example of accessing the hidden object data in form submission
  onSubmit: async (values) => {
    console.log('Form submitted with values:', values);
    
    // Access the hidden object data
    const userMetadata = values.userMetadata;
    const previousOrders = values.previousOrders;
    
    console.log('User metadata:', userMetadata);
    console.log('Previous orders:', previousOrders);
    
    // You can manipulate or use this data before sending to the server
    // For example, you might want to include only certain fields from the metadata
    const dataToSubmit = {
      ...values,
      userType: userMetadata.userType,
      hasOrders: previousOrders.length > 0
    };
    
    // Mock API call
    return {
      success: true,
      message: 'Form submitted successfully'
    };
  }
};

export default hiddenObjectFormExample;