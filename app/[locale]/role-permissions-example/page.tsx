import React from 'react';
import RolePermissionsExample from '@/modules/form-builder/examples/RolePermissionsExample';

export default function RolePermissionsExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Role & Permissions Management Example</h1>
      <p className="mb-6">
        This page demonstrates how to create a role and permissions management form using the form builder with checkboxes.
      </p>
      
      <RolePermissionsExample />
    </div>
  );
}