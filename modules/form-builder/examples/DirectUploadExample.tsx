"use client";

import React, { useState } from "react";
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

const DirectUploadExample: React.FC = () => {
  // State to track uploaded images
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // Mock upload endpoint (in a real app, this would be a real API endpoint)
  const mockUploadUrl = "/api/mock-upload";
  
  // Define the form configuration with direct upload
  const formConfig: FormConfig = {
    title: "Direct Upload Example",
    description: "This form demonstrates direct upload with progress tracking",
    sections: [
      {
        title: "Project Information",
        fields: [
          {
            type: "text",
            name: "projectName",
            label: "Project Name",
            placeholder: "Enter project name",
            required: true,
            validation: [
              {
                type: "required",
                message: "Project name is required",
              },
            ],
          },
          {
            type: "image",
            name: "projectImages",
            label: "Project Images",
            isMulti: true, // Enable multi-image upload
            required: true,
            validation: [
              {
                type: "required",
                message: "At least one project image is required",
              },
            ],
            imageConfig: {
              allowedFileTypes: ["image/jpeg", "image/png", "image/gif"],
              maxFileSize: 10 * 1024 * 1024, // 10MB per image
              previewWidth: 150,
              previewHeight: 150,
              // In a real application, this would be a real API endpoint
              uploadUrl: mockUploadUrl,
              // You can add custom headers for authentication
              uploadHeaders: {
                "X-Custom-Header": "custom-value",
              },
            },
          },
        ],
      },
    ],
    submitButtonText: "Save Project",
    resetButtonText: "Reset",
    showReset: true,
    onSubmit: async (values) => {
      // In a real application, you would handle the form submission here
      console.log("Form values:", values);
      
      // The images have already been uploaded during the image field's upload process
      // The values.projectImages will contain the URLs returned from the upload endpoint
      
      // For demonstration purposes, we'll just return a success response
      return {
        success: true,
        message: "Project saved successfully",
      };
    },
  };

  // Set up mock XMLHttpRequest for demonstration purposes
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Store original methods
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    // Create a WeakMap to store private data for each XHR instance
    const xhrMap = new WeakMap();
    
    // Override the open method
    XMLHttpRequest.prototype.open = function(this: XMLHttpRequest, method: string, url: string | URL, ...args: any[]) {
      // Call original method
      originalOpen.apply(this, [method, url, ...(args as [boolean, string | null, string | null])]);
      
      // Store private data for this instance
      if (typeof url === 'string' && url === mockUploadUrl) {
        xhrMap.set(this, { isMockUpload: true });
      }
    };
    
    // Override the send method
    XMLHttpRequest.prototype.send = function(this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
      const privateData = xhrMap.get(this);
      
      if (privateData?.isMockUpload) {
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress > 100) progress = 100;
          
          // Create and dispatch a progress event
          const progressEvent = new ProgressEvent('progress', {
            lengthComputable: true,
            loaded: progress,
            total: 100
          });
          
          this.upload.dispatchEvent(progressEvent);
          
          if (progress === 100) {
            clearInterval(interval);
            
            // Simulate a short delay for server processing
            setTimeout(() => {
              // Generate a random image URL
              const imageUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/300/300`;
              
              // Add to our state for display
              setUploadedImages(prev => [...prev, imageUrl]);
              
              // Create a mock response
              const response = JSON.stringify({
                success: true,
                url: imageUrl
              });
              
              // Set response properties
              Object.defineProperty(this, 'status', { value: 200 });
              Object.defineProperty(this, 'statusText', { value: 'OK' });
              Object.defineProperty(this, 'responseText', { value: response });
              
              // Dispatch load event
              const loadEvent = new Event('load');
              this.dispatchEvent(loadEvent);
            }, 500);
          }
        }, 300);
        
        return;
      }
      
      // Call original method for non-mock requests
      originalSend.call(this, body);
    };
    
    // Cleanup function to restore original methods
    return () => {
      XMLHttpRequest.prototype.open = originalOpen;
      XMLHttpRequest.prototype.send = originalSend;
    };
  }, [mockUploadUrl, setUploadedImages]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Direct Upload with Progress Example</h1>
      
      <SheetFormBuilder
        config={formConfig}
        trigger={<Button>Open Form</Button>}
        onSuccess={(values: Record<string, any>) => {
          console.log("Form submitted successfully:", values);
          alert("Project saved successfully!");
        }}
      />
      
      {uploadedImages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
          <div className="flex flex-wrap gap-4">
            {uploadedImages.map((url, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <img 
                  src={url} 
                  alt={`Uploaded ${index + 1}`} 
                  className="w-[150px] h-[150px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            This example demonstrates direct upload with progress tracking.
          </li>
          <li>
            In a real application, you would replace the mock upload URL with a real API endpoint.
          </li>
          <li>
            The progress bar is displayed during the upload process.
          </li>
          <li>
            Each file is uploaded individually as soon as it's selected.
          </li>
          <li>
            The form submission only happens after all files have been uploaded.
          </li>
          <li>
            The form value contains the URLs returned from the upload endpoint.
          </li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-muted rounded-md">
        <h2 className="text-lg font-semibold mb-2">Implementation Example:</h2>
        <pre className="bg-black text-white p-4 rounded-md overflow-auto text-sm">
{`{
  type: "image",
  name: "projectImages",
  label: "Project Images",
  isMulti: true,
  imageConfig: {
    allowedFileTypes: ["image/jpeg", "image/png"],
    maxFileSize: 10 * 1024 * 1024, // 10MB per image
    previewWidth: 150,
    previewHeight: 150,
    uploadUrl: "/api/upload-images",
    uploadHeaders: {
      "Authorization": "Bearer your-token"
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default DirectUploadExample;