"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { PRJ_ProjectTerm } from "@/types/api/projects/project-term/index";

interface ViewProjectTermDialogProps {
  open: boolean;
  onClose: () => void;
  item: PRJ_ProjectTerm | null;
}

export function ViewProjectTermDialog({ open, onClose, item }: ViewProjectTermDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>تفاصيل البند الرئيسي</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              الرقم المرجعي
            </Typography>
            <Typography variant="body1">
              {item.reference_number}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              اسم البند
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {item.name}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              وصف البند
            </Typography>
            <Typography variant="body1">
              {item.description}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              عدد البنود الفرعية
            </Typography>
            <Typography variant="body1">
              {item.sub_items_count}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              الحالة
            </Typography>
            <Chip
              label={item.status === 1 ? "نشط" : "غير نشط"}
              color={item.status === 1 ? "success" : "default"}
              size="small"
            />
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              تاريخ الإنشاء
            </Typography>
            <Typography variant="body2">
              {new Date(item.created_at).toLocaleDateString("ar-EG")}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              آخر تحديث
            </Typography>
            <Typography variant="body2">
              {new Date(item.updated_at).toLocaleDateString("ar-EG")}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إغلاق</Button>
      </DialogActions>
    </Dialog>
  );
}
