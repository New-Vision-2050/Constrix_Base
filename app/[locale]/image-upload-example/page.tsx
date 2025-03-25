import React from 'react';
import ImageUploadExample from '@/modules/form-builder/examples/ImageUploadExample';

export default function ImageUploadExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Image Upload Field Example</h1>
      <p className="mb-6">
        This page demonstrates the image upload field functionality in the form builder.
      </p>
      
      <ImageUploadExample />
    </div>
  );
}