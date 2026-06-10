"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("familyMembers")}</DialogTitle>
        </DialogHeader>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-start font-medium">
                  {t("memberName")}
                </th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("nationalId")}
                </th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("relation")}
                </th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("amount")}
                </th>
                <th className="px-4 py-3 text-start font-medium">
                  {t("subscriptionNo")}
                </th>
                <th className="px-4 py-3 text-center font-medium w-24">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {familyMembers.map((member, index) => (
                <tr key={member.id || index} className="border-t">
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.national_id}</td>
                  <td className="px-4 py-3">{member.relation}</td>
                  <td className="px-4 py-3">{member.amount}</td>
                  <td className="px-4 py-3">{member.subscription_no || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {familyMembers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {t("noFamilyMembers")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Form */}
        {showForm ? (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {editingIndex !== null ? t("editMember") : t("addMember")}
              </h4>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("memberName")}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t("placeholders.memberName")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("nationalId")}</Label>
                <Input
                  value={formData.national_id}
                  onChange={(e) =>
                    setFormData({ ...formData, national_id: e.target.value })
                  }
                  placeholder={t("placeholders.nationalId")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("relation")}</Label>
                <Input
                  value={formData.relation}
                  onChange={(e) =>
                    setFormData({ ...formData, relation: e.target.value })
                  }
                  placeholder={t("placeholders.relation")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("amount")}</Label>
                <Input
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder={t("placeholders.memberAmount")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("subscriptionNo")}</Label>
                <Input
                  value={formData.subscription_no || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subscription_no: e.target.value,
                    })
                  }
                  placeholder={t("placeholders.subscriptionNo")}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
              <Button onClick={handleAdd}>
                {editingIndex !== null ? "تحديث" : "إضافة"}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowForm(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 me-2" />
            {t("addMember")}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
