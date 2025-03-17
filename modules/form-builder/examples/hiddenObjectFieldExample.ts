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
      title: 'Conditional Hidden Objects',
      fields: [
        {
          type: 'select',
          name: 'accountType',
          label: 'Account Type',
          required: true,
          options: [
            { value: 'personal', label: 'Personal' },
            { value: 'business', label: 'Business' }
          ]
        },
        // This hidden object will only be included when accountType is 'business'
        {
          type: 'hiddenObject',
          name: 'businessDetails',
          label: 'Business Details',
          condition: (values) => values.accountType === 'business',
          defaultValue: {
            companyType: 'llc',
            employeeCount: 0,
            industry: 'technology',
            taxExempt: false
          }
        },
        // This hidden object will only be included when accountType is 'personal'
        {
          type: 'hiddenObject',
          name: 'personalPreferences',
          label: 'Personal Preferences',
          condition: (values) => values.accountType === 'personal',
          defaultValue: {
            privacyLevel: 'high',
            communicationFrequency: 'weekly',
            interests: ['technology', 'sports']
          }
        },
        // Example of a hidden object with custom validation
        {
          type: 'hiddenObject',
          name: 'cartData',
          label: 'Shopping Cart Data',
          defaultValue: {
            items: [],
            totalAmount: 0,
            discount: 0
          },
          validation: [
            {
              type: 'custom',
              message: 'Cart must have at least one item',
              validator: (value) => {
                // Check if the value is defined and has items
                if (!value || !value.items || !Array.isArray(value.items)) {
                  return false;
                }
                // Check if there's at least one item
                return value.items.length > 0;
              }
            },
            {
              type: 'custom',
              message: 'Discount cannot exceed 50% of total amount',
              validator: (value, formValues) => {
                if (!value || typeof value.totalAmount !== 'number' || typeof value.discount !== 'number') {
                  return true; // Skip validation if values are not numbers
                }
                // Check if discount is valid
                return value.discount <= (value.totalAmount * 0.5);
              }
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
    
    // Conditional hidden objects will only be present if their condition is met
    if (values.accountType === 'business') {
      // businessDetails will be present, personalPreferences will not
      console.log('Business details:', values.businessDetails);
      console.log('Personal preferences exists:', values.personalPreferences !== undefined); // Will be false
    } else if (values.accountType === 'personal') {
      // personalPreferences will be present, businessDetails will not
      console.log('Personal preferences:', values.personalPreferences);
      console.log('Business details exists:', values.businessDetails !== undefined); // Will be false
    }
    
    // Check the cartData validation - this would normally be handled by the form validation system
    // but we're showing how to manually validate it here
    const cartData = values.cartData;
    if (cartData) {
      console.log('Cart data:', cartData);
      
      // Manually validate the cart data
      if (!cartData.items || cartData.items.length === 0) {
        console.log('Validation error: Cart must have at least one item');
      }
      
      if (cartData.discount > (cartData.totalAmount * 0.5)) {
        console.log('Validation error: Discount cannot exceed 50% of total amount');
      }
    }
    
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