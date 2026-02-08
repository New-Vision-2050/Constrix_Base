"use client";

import { useState, useRef } from "react";
import ImageCrop from "@/components/shared/image-crop";
import ImageUploadWithCrop from "@/components/shared/image-upload-with-crop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Check } from "lucide-react";
import VisuallyHiddenInput from "@/components/shared/VisuallyHiddenInput";
import { Box } from "@mui/material";

export default function ImageCropTestPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setCroppedImage(null);
      setSavedImage(null);
    }
  };

  const handleSave = () => {
    if (croppedImage) {
      setSavedImage(croppedImage);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setCroppedImage(null);
    setSavedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ImageUploadWithCrop Component Demo */}
      <Card>
        <CardHeader>
          <CardTitle>ImageUploadWithCrop Component (Integrated Flow)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This component combines file selection, cropping, and state
            management in one. Click the button, select an image, crop it, and
            save.
          </p>
          
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <ImageUploadWithCrop
              onChange={(file, base64) => {
                setUploadedFile(file);
                setUploadedBase64(base64);
                // Simulate backend upload
                if (file && base64) {
                  setIsUploading(true);
                  setTimeout(() => {
                    console.log("Uploaded to backend:", { file, base64 });
                    setIsUploading(false);
                  }, 1500);
                }
              }}
              cropOptions={{
                maxWidth: 800,
                maxHeight: 600,
                minWidth: 50,
                minHeight: 50,
              }}
              loading={isUploading}
              previewImage={uploadedBase64}
              disabled={false}
            />
          </Box>

          {uploadedFile && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/30">
              <p className="text-sm font-semibold mb-2">File State:</p>
              <pre className="text-xs bg-background p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    name: uploadedFile.name,
                    size: uploadedFile.size,
                    type: uploadedFile.type,
                  },
                  null,
                  2
                )}
              </pre>
              {uploadedBase64 && (
                <>
                  <p className="text-sm font-semibold mb-2 mt-4">Base64 Preview (first 100 chars):</p>
                  <pre className="text-xs bg-background p-2 rounded overflow-auto">
                    {uploadedBase64.substring(0, 100)}...
                  </pre>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Original ImageCrop Component Demo */}
      <Card>
        <CardHeader>
          <CardTitle>ImageCrop Component (Manual Flow)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={!!selectedImage}
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedImage ? "Image Selected" : "Select Image"}
              </Button>

              {selectedImage && (
                <>
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <X className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedImage.name}
                  </span>
                </>
              )}

              <VisuallyHiddenInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </div>
          </div>

          {/* Crop Component */}
          {selectedImage && (
            <div className="space-y-4">
              <ImageCrop
                image={selectedImage}
                croppedImage={croppedImage}
                onCropChange={setCroppedImage}
                options={{
                  maxWidth: 1080,
                  maxHeight: 1080,
                  aspect: 16 / 9,
                }}
              />

              {/* Save Button */}
              <div className="flex justify-center">
                <Button onClick={handleSave} disabled={!croppedImage} size="lg">
                  <Check className="h-4 w-4 mr-2" />
                  Save Cropped Image
                </Button>
              </div>
            </div>
          )}

          {/* Final Result */}
          {savedImage && (
            <Card className="border-green-500">
              <CardHeader>
                <CardTitle className="text-green-600">
                  ✓ Final Result (Saved)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={savedImage}
                    alt="Final cropped result"
                    className="max-w-full max-h-[500px] object-contain border rounded-lg shadow-lg"
                  />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <strong>Status:</strong> Image cropped and saved
                      successfully
                    </p>
                    <p>
                      <strong>URL:</strong>{" "}
                      <code className="bg-muted px-2 py-1 rounded text-xs break-all">
                        {savedImage.substring(0, 100)}...
                      </code>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {!selectedImage && (
            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/30">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Select an image to start cropping
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
