"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";

export type FamilyMember = {
  id?: string;
  name: string;
  national_id: string;
  relation: string;
  amount: string;
  subscription_no?: string;
};

type FamilyMembersDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyMembers: FamilyMember[];
  onFamilyMembersChange: (members: FamilyMember[]) => void;
};

export default function FamilyMembersDialog({
  open,
  onOpenChange,
  familyMembers,
  onFamilyMembersChange,
}: FamilyMembersDialogProps) {
  const t = useTranslations(
    "UserProfile.nestedTabs.privilegesAndAllowances.edit.subscriptions",
  );
  const isRtl = useIsRtl();
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FamilyMember>({
    name: "",
    national_id: "",
    relation: "",
    amount: "",
    subscription_no: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      national_id: "",
      relation: "",
      amount: "",
      subscription_no: "",
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    if (
      !formData.name ||
      !formData.national_id ||
      !formData.relation ||
      !formData.amount
    ) {
      return;
    }

    if (editingIndex !== null) {
      const updated = [...familyMembers];
      updated[editingIndex] = formData;
      onFamilyMembersChange(updated);
    } else {
      onFamilyMembersChange([
        ...familyMembers,
        { ...formData, id: crypto.randomUUID() },
      ]);
    }
    resetForm();
  };

  const handleEdit = (index: number) => {
    setFormData(familyMembers[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    const updated = familyMembers.filter((_, i) => i !== index);
    onFamilyMembersChange(updated);
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="md"
      fullWidth
      dir={isRtl ? "rtl" : "ltr"}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">{t("familyMembers")}</Typography>
        <IconButton onClick={() => onOpenChange(false)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflow: "auto" }}>
        {/* Table */}
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 600 }}>
                  {t("memberName")}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {t("nationalId")}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t("relation")}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t("amount")}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {t("subscriptionNo")}
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, textAlign: "center", width: 100 }}
                >
                  {isRtl ? "إجراءات" : "Actions"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {familyMembers.map((member, index) => (
                <TableRow key={member.id || index}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.national_id}</TableCell>
                  <TableCell>{member.relation}</TableCell>
                  <TableCell>{member.amount}</TableCell>
                  <TableCell>{member.subscription_no || "-"}</TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {familyMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">
                      {t("noFamilyMembers")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Form */}
        {showForm ? (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={500}>
                {editingIndex !== null ? t("editMember") : t("addMember")}
              </Typography>
              <IconButton size="small" onClick={resetForm}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                size="small"
                label={t("memberName")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t("placeholders.memberName")}
                fullWidth
              />
              <TextField
                size="small"
                label={t("nationalId")}
                value={formData.national_id}
                onChange={(e) =>
                  setFormData({ ...formData, national_id: e.target.value })
                }
                placeholder={t("placeholders.nationalId")}
                fullWidth
              />
              <TextField
                size="small"
                label={t("relation")}
                value={formData.relation}
                onChange={(e) =>
                  setFormData({ ...formData, relation: e.target.value })
                }
                placeholder={t("placeholders.relation")}
                fullWidth
              />
              <TextField
                size="small"
                label={t("amount")}
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder={t("placeholders.memberAmount")}
                fullWidth
              />
              <TextField
                size="small"
                label={t("subscriptionNo")}
                value={formData.subscription_no || ""}
                onChange={(e) =>
                  setFormData({ ...formData, subscription_no: e.target.value })
                }
                placeholder={t("placeholders.subscriptionNo")}
                fullWidth
              />
            </Box>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button variant="outlined" onClick={resetForm}>
                {isRtl ? "إلغاء" : "Cancel"}
              </Button>
              <Button variant="contained" onClick={handleAdd}>
                {editingIndex !== null
                  ? isRtl
                    ? "تحديث"
                    : "Update"
                  : isRtl
                    ? "إضافة"
                    : "Add"}
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            fullWidth
          >
            {t("addMember")}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
