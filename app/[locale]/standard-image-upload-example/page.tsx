import React from 'react';
import StandardImageUploadExample from '@/modules/form-builder/examples/StandardImageUploadExample';

export default function StandardImageUploadExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Standard Image Upload Field Example</h1>
      <p className="mb-6">
        This page demonstrates the image upload field functionality with the standard form builder.
      </p>
      
      <StandardImageUploadExample />
    </div>
  );
}