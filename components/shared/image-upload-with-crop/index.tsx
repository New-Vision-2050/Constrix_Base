"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageCrop, { ImageCropOptions } from "@/components/shared/image-crop";
import { base64ToFile } from "@/utils/base64-to-file";
import { useTranslations } from "next-intl";

export interface ImageUploadWithCropProps {
  onChange: (file: File | null, base64Image: string | null) => void;
  cropOptions?: ImageCropOptions;
  loading?: boolean;
  previewImage?: string | null;
  disabled?: boolean;
  renderButton?: (params: {
    onClick: () => void;
    image: string | null;
    file: File | null;
    clearImage: () => void;
    loading: boolean;
    disabled: boolean;
  }) => React.ReactNode;
}

export default function ImageUploadWithCrop({
  onChange,
  cropOptions,
  loading = false,
  previewImage = null,
  disabled = false,
  renderButton,
}: ImageUploadWithCropProps) {
  const t = useTranslations("ImageUploadCrop");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(
    previewImage
  );
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [tempSelectedFile, setTempSelectedFile] = useState<File | null>(null);
  const [tempCroppedImageUrl, setTempCroppedImageUrl] = useState<
    string | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update croppedImageUrl when previewImage prop changes
  useEffect(() => {
    if (previewImage) {
      setCroppedImageUrl(previewImage);
    }
  }, [previewImage]);

  const handleButtonClick = () => {
    if (disabled || loading) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setTempSelectedFile(file);
      setTempCroppedImageUrl(null);
      setDialogOpen(true);
    }
    // Reset input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDialogClose = () => {
    // Keep previous image on cancel
    setDialogOpen(false);
    setTempSelectedFile(null);
    setTempCroppedImageUrl(null);
  };

  const handleSave = useCallback(() => {
    if (tempCroppedImageUrl) {
      // Convert the cropped image URL to File
      const file = base64ToFile(tempCroppedImageUrl, "cropped-image.png");
      
      setCroppedImageUrl(tempCroppedImageUrl);
      setCroppedFile(file);
      setSelectedFile(tempSelectedFile);
      
      // Call onChange with both file and base64 string
      onChange(file, tempCroppedImageUrl);
      
      // Close dialog
      setDialogOpen(false);
      setTempSelectedFile(null);
      setTempCroppedImageUrl(null);
    }
  }, [tempCroppedImageUrl, tempSelectedFile, onChange]);

  const handleClearImage = useCallback(() => {
    if (disabled || loading) return;
    
    setSelectedFile(null);
    setCroppedImageUrl(null);
    setCroppedFile(null);
    onChange(null, null);
  }, [onChange, disabled, loading]);

  // Default render button
  const defaultRenderButton = useCallback(
    () => (
      <Box sx={{ position: "relative" }}>
        {!croppedImageUrl ? (
          // Upload placeholder - square design with MUI
          <Box
            onClick={handleButtonClick}
            sx={{
              width: 280,
              height: 280,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              border: "2px dashed",
              borderColor: disabled ? "action.disabled" : "divider",
              borderRadius: 2,
              cursor: disabled || loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease-in-out",
              bgcolor: "background.paper",
              opacity: disabled ? 0.5 : 1,
              "&:hover":
                !disabled && !loading
                  ? {
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                      "& .upload-icon": {
                        transform: "scale(1.1)",
                        color: "primary.main",
                      },
                    }
                  : {},
            }}
          >
            <CloudUploadIcon
              className="upload-icon"
              sx={{
                fontSize: 64,
                color: "text.secondary",
                transition: "all 0.2s ease-in-out",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                pointerEvents: "none",
                fontWeight: 500,
              }}
            >
              {loading ? t("uploading") : t("uploadTitle")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: "center", px: 2 }}
            >
              {loading ? t("pleaseWait") : t("clickToSelect")}
            </Typography>
          </Box>
        ) : (
          // Image preview - square with overlay controls
          <Box sx={{ position: "relative" }}>
            <Box
              onClick={handleButtonClick}
              sx={{
                width: 280,
                height: 280,
                border: "2px solid",
                borderColor: loading ? "action.disabled" : "primary.main",
                borderRadius: 2,
                overflow: "hidden",
                cursor: disabled || loading ? "not-allowed" : "pointer",
                position: "relative",
                transition: "all 0.2s ease-in-out",
                opacity: loading ? 0.7 : 1,
                "&:hover":
                  !disabled && !loading
                    ? {
                        "& .image-overlay": {
                          opacity: 1,
                        },
                      }
                    : {},
              }}
            >
              <img
                src={croppedImageUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {!loading && (
                <Box
                  className="image-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {t("changeImage")}
                  </Typography>
                </Box>
              )}
              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "white", fontWeight: 500 }}
                  >
                    {t("uploading")}
                  </Typography>
                </Box>
              )}
            </Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleClearImage();
              }}
              disabled={disabled || loading}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "error.main",
                  color: "white",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    ),
    [croppedImageUrl, handleButtonClick, disabled, loading, handleClearImage, t]
  );

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={disabled || loading}
      />

      {/* Render button using render prop or default */}
      {renderButton
        ? renderButton({
            onClick: handleButtonClick,
            image: croppedImageUrl,
            file: croppedFile,
            clearImage: handleClearImage,
            loading,
            disabled,
          })
        : defaultRenderButton()}

      {/* Crop Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {t("cropDialogTitle")}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {tempSelectedFile && (
            <ImageCrop
              image={tempSelectedFile}
              croppedImage={tempCroppedImageUrl}
              onCropChange={setTempCroppedImageUrl}
              options={cropOptions}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDialogClose} variant="outlined">
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!tempCroppedImageUrl}
          >
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
