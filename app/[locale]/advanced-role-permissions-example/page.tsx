import React from 'react';
import AdvancedRolePermissionsExample from '@/modules/form-builder/examples/AdvancedRolePermissionsExample';

export default function AdvancedRolePermissionsExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Advanced Role & Permissions Management Example</h1>
      <p className="mb-6">
        This page demonstrates an advanced implementation of a role and permissions management form using the form builder with &quot;Select All&quot; functionality for each permission group.
      </p>
      
      <AdvancedRolePermissionsExample />
    </div>
  );
}