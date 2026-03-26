"use client";

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import ConfirmationDialog from "../../../../components/shared/ConfirmationDialog";
import { useTranslations } from "next-intl";
import { Media } from "@/modules/docs-library/modules/publicDocs/types/Directory";

/** Existing server-side sub-images or URL strings; combined with new `File` picks in the form. */
export type SubImageStoredValue = string | Media | { id: string; url: string };
export type SubImageFieldValue = SubImageStoredValue | File;

export interface ProjectImageUploadProps {
  label: string;
  required?: boolean;
  onChange?: (file: File | null) => void;
  onMultipleChange?: (files: SubImageFieldValue[]) => void;
  initialValue?: string | Media[] | { id: string; url: string }[] | null;
  className?: string;
  multiple?: boolean;
  accept?: string;
  showDeleteConfirm?: boolean;
  OnDelete?: (input: unknown) => Promise<void>;
}

const dashedBoxSx = {
  border: "2px dashed",
  borderColor: "#3c345a",
  borderRadius: 2,
  background:
    "linear-gradient(135deg, rgba(26, 11, 46, 0.3) 0%, rgba(45, 27, 78, 0.3) 50%, rgba(26, 11, 46, 0.3) 100%)",
  "&:hover": {
    borderColor: "primary.main",
    opacity: 0.95,
  },
  transition: "border-color 0.2s, opacity 0.2s",
} as const;

/**
 * Compact project form image field: title + icon + attach button only (no size/dimension hints).
 * Title is shown inside the dashed area (matches project dialog layout).
 */
export default function ProjectImageUpload({
  label,
  required = false,
  onChange,
  onMultipleChange,
  initialValue,
  className = "",
  multiple = false,
  accept = "image/*",
  showDeleteConfirm = false,
  OnDelete,
}: ProjectImageUploadProps) {
  const t = useTranslations(
    "content-management-system.projects.addProjectForm",
  );
  const tCommon = useTranslations("common.imageUpload");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [initialPreviews, setInitialPreviews] = useState<SubImageStoredValue[]>(
    [],
  );
  const [uploadId, setUploadId] = useState<string>("");

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SubImageStoredValue | null>(
    null,
  );

  useEffect(() => {
    setUploadId(`upload-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    if (initialValue) {
      if (multiple && Array.isArray(initialValue)) {
        setInitialPreviews([...initialValue] as SubImageStoredValue[]);
      } else if (!multiple && typeof initialValue === "string") {
        setImagePreview(initialValue);
      }
    }
  }, [initialValue, multiple]);

  useEffect(() => {
    const next = selectedFiles.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
    );
    setFilePreviewUrls(next);
    return () => {
      next.forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [selectedFiles]);

  const galleryItems = useMemo(() => {
    const items: Array<{
      key: string;
      url: string;
      kind: "initial" | "file";
      idx: number;
    }> = [];
    initialPreviews.forEach((item, idx) => {
      const url = typeof item === "string" ? item : item?.url || "";
      items.push({ key: `init-${idx}`, url, kind: "initial", idx });
    });
    selectedFiles.forEach((_, idx) => {
      items.push({
        key: `file-${idx}`,
        url: filePreviewUrls[idx] || "",
        kind: "file",
        idx,
      });
    });
    return items;
  }, [initialPreviews, selectedFiles, filePreviewUrls]);

  useEffect(() => {
    if (multiple && galleryOpen && galleryItems.length === 0) {
      setGalleryOpen(false);
    }
  }, [multiple, galleryOpen, galleryItems.length]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const newFiles = Array.from(e.target.files || []);
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);
      const mergedData: SubImageFieldValue[] = [
        ...initialPreviews,
        ...updatedFiles,
      ];
      onMultipleChange?.(mergedData);
      e.target.value = "";
    } else {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onChange?.(file);
      }
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setSelectedFiles([]);
    onChange?.(null);
    onMultipleChange?.([]);
    if (uploadId) {
      const input = document.getElementById(uploadId) as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  const handleConfirmDelete = async () => {
    await OnDelete?.(itemToDelete);

    if (multiple) {
      const itemIndex = initialPreviews.findIndex((item) => {
        if (typeof item === "string") {
          return item === itemToDelete;
        }
        if (
          item &&
          typeof item === "object" &&
          "id" in item &&
          itemToDelete &&
          typeof itemToDelete === "object" &&
          "id" in itemToDelete
        ) {
          return String(item.id) === String(itemToDelete.id);
        }
        return false;
      });

      if (itemIndex !== -1) {
        removeInitialImage(itemIndex);
      }
    } else {
      removeImage();
    }

    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    const mergedData: SubImageFieldValue[] = [...initialPreviews, ...newFiles];
    onMultipleChange?.(mergedData);
  };

  const removeInitialImage = (index: number) => {
    const newPreviews = initialPreviews.filter((_, i) => i !== index);
    setInitialPreviews(newPreviews);
    const mergedData: SubImageFieldValue[] = [...newPreviews, ...selectedFiles];
    onMultipleChange?.(mergedData);
  };

  const requestDeleteInGallery = (
    kind: "initial" | "file",
    idx: number,
    item?: SubImageStoredValue,
  ) => {
    if (kind === "file") {
      removeFile(idx);
      return;
    }
    if (showDeleteConfirm && item !== undefined) {
      setGalleryOpen(false);
      setItemToDelete(item);
      setOpenDeleteDialog(true);
    } else {
      removeInitialImage(idx);
    }
  };

  const emptyDropzoneSx = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    minHeight: 200,
    px: 1.5,
    pt: 1.5,
    pb: 2,
    bgcolor: "rgba(26, 26, 46, 0.5)",
    ...dashedBoxSx,
  };

  const hasMultipleImages = multiple && galleryItems.length > 0;
  const firstThumbUrl = galleryItems[0]?.url ?? "";

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        height: "100%",
        minHeight: 0,
        flexDirection: "column",
      }}
    >
      {!multiple && (
        <>
          {imagePreview ? (
            <Box
              sx={{
                position: "relative",
                display: "flex",
                height: "180px",
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                ...dashedBoxSx,
              }}
            >
              <Box
                component="img"
                src={imagePreview}
                alt={label}
                sx={{
                  maxHeight: 150,
                  objectFit: "contain",
                  borderRadius: 1,
                }}
                sizes="100px"
              />
              <IconButton
                type="button"
                size="small"
                onClick={() => {
                  if (showDeleteConfirm) {
                    setGalleryOpen(false);
                    setItemToDelete(imagePreview);
                    setOpenDeleteDialog(true);
                  } else {
                    removeImage();
                  }
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "error.main",
                  color: "error.contrastText",
                  "&:hover": { bgcolor: "error.dark" },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          ) : uploadId ? (
            <Box sx={emptyDropzoneSx}>
              <Typography
                variant="caption"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {label}
                {required ? " *" : ""}
              </Typography>
              <CloudUploadIcon
                sx={{ fontSize: 40, color: "grey.500", flexShrink: 0 }}
              />
              <Box
                component="label"
                htmlFor={uploadId}
                sx={{ width: "100%", px: 0.5 }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => document.getElementById(uploadId)?.click()}
                >
                  {tCommon("attach")}
                </Button>
              </Box>
              <input
                id={uploadId}
                type="file"
                accept={accept}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </Box>
          ) : null}
        </>
      )}

      {multiple && (
        <>
          {hasMultipleImages ? (
            <Box
              role="button"
              tabIndex={0}
              onClick={() => setGalleryOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setGalleryOpen(true);
                }
              }}
              sx={{
                ...emptyDropzoneSx,
                cursor: "pointer",
                justifyContent: "flex-start",
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {label}
                {required ? " *" : ""}
              </Typography>

              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  flex: 1,
                  height: "180px",
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: "rgba(0,0,0,0.25)",
                }}
              >
                {firstThumbUrl ? (
                  <Box
                    component="img"
                    src={firstThumbUrl}
                    alt=""
                    sx={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                    }}
                    sizes="100px"
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",

                      height: "180px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UploadFileIcon sx={{ fontSize: 40, color: "grey.500" }} />
                  </Box>
                )}
                {galleryItems.length > 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      insetInlineEnd: 8,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" fontWeight={700}>
                      +{galleryItems.length - 1}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  width: "100%",
                  position: "absolute",
                  bottom: 10,
                  color: "white",
                }}
              >
                {`${galleryItems.length} — اضغط للعرض والتعديل`}
              </Typography>
            </Box>
          ) : uploadId ? (
            <Box sx={{ ...emptyDropzoneSx }}>
              <Typography
                variant="caption"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {label}
                {required ? " *" : ""}
              </Typography>
              <CloudUploadIcon
                sx={{ fontSize: 40, color: "grey.500", flexShrink: 0 }}
              />
              <Button
                type="button"
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => document.getElementById(uploadId)?.click()}
              >
                {tCommon("attach")}
              </Button>
            </Box>
          ) : null}

          <Dialog
            open={galleryOpen}
            onClose={() => setGalleryOpen(false)}
            maxWidth="sm"
            fullWidth
            disableEnforceFocus
            disableAutoFocus
            disableRestoreFocus
            disableScrollLock
            PaperProps={{
              sx: {
                bgcolor: "background.paper",
                backgroundImage: "none",
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                pr: 1,
              }}
            >
              <Typography component="span" variant="h6">
                {label}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={() => setGalleryOpen(false)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 1.5,
                }}
              >
                {galleryItems.map((g) => {
                  const initialItem =
                    g.kind === "initial" ? initialPreviews[g.idx] : undefined;
                  return (
                    <Box
                      key={g.key}
                      sx={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: 1,
                        overflow: "hidden",
                        bgcolor: "action.hover",
                      }}
                    >
                      {g.url ? (
                        <Box
                          component="img"
                          src={g.url}
                          alt=""
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UploadFileIcon sx={{ color: "grey.500" }} />
                        </Box>
                      )}
                      <IconButton
                        type="button"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDeleteInGallery(g.kind, g.idx, initialItem);
                        }}
                        sx={{
                          position: "absolute",
                          top: 4,
                          insetInlineEnd: 4,
                          bgcolor: "error.main",
                          color: "error.contrastText",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>

              <Button
                type="button"
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                startIcon={<CloudUploadIcon />}
                onClick={() => {
                  document.getElementById(uploadId)?.click();
                }}
              >
                {tCommon("attach")}
              </Button>
            </DialogContent>
          </Dialog>

          {multiple && uploadId ? (
            <input
              id={uploadId}
              type="file"
              accept={accept}
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          ) : null}
        </>
      )}

      {showDeleteConfirm && (
        <ConfirmationDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          description={t("deleteConfirmMessage") ?? ""}
          showDatePicker={false}
        />
      )}
    </Box>
  );
}
