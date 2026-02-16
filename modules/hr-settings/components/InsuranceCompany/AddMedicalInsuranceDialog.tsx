"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MedicalInsuranceRow, CreateMedicalInsuranceForm, UpdateMedicalInsuranceForm, Employee } from "./types";
import { MedicalInsuranceApi } from "@/services/api/medical-insurance";
import { baseApi } from "@/config/axios/instances/base";
import { toast } from "sonner";

interface AddMedicalInsuranceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingInsurance?: MedicalInsuranceRow | null;
  onSuccess: () => void;
}

export default function AddMedicalInsuranceDialog({
  open,
  onOpenChange,
  editingInsurance,
  onSuccess,
}: AddMedicalInsuranceDialogProps) {
  const t = useTranslations("hr-settings.insurance");

  // Form state
  const [formData, setFormData] = useState<CreateMedicalInsuranceForm>({
    name: "",
    policy_number: "",
    employee_id: "",
    status: 1,
    end_date: "",
  });

  // Fetch employees for dropdown
  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await baseApi.get("company-users/employees");
      console.log("Full API Response:", response);
      console.log("Response data:", response.data);
      console.log("Employees array:", response.data.payload);
      return response.data.payload || [];
    },
  });

  // Reset form when dialog opens/closes or editing insurance changes
  useEffect(() => {
    if (open) {
      if (editingInsurance) {
        setFormData({
          name: editingInsurance.name,
          policy_number: editingInsurance.policy_number,
          employee_id: editingInsurance.employee_id,
          status: editingInsurance.status,
          end_date: editingInsurance.end_date || "",
        });
      } else {
        setFormData({
          name: "",
          policy_number: "",
          employee_id: "",
          status: 1,
          end_date: "",
        });
      }
    }
  }, [open, editingInsurance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.policy_number || !formData.employee_id) {
      toast.error(t("allFieldsRequired"));
      return;
    }

    try {
      if (editingInsurance) {
        await MedicalInsuranceApi.update(editingInsurance.id, formData as UpdateMedicalInsuranceForm);
        toast.success(t("updateSuccess"));
      } else {
        await MedicalInsuranceApi.create(formData);
        toast.success(t("addSuccess"));
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(t("saveError"));
    }
  };

  const handleInputChange = (field: keyof CreateMedicalInsuranceForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full bg-sidebar">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {editingInsurance ? t("editInsurance") : t("addInsurance")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("name")}
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("enterName")}
                className="bg-sidebar border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("policyNumber")}
              </label>
              <Input
                value={formData.policy_number}
                onChange={(e) => handleInputChange("policy_number", e.target.value)}
                placeholder={t("enterPolicyNumber")}
                className="bg-sidebar border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("employee")}
              </label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => handleInputChange("employee_id", value)}
              >
                <SelectTrigger className="bg-sidebar border-gray-700">
                  <SelectValue placeholder={t("selectEmployee")} />
                </SelectTrigger>
                <SelectContent>
                  {console.log("Employees Data in dropdown:", employeesData)}
                  {employeesData?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                تاريخ الانتهاء
              </label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="bg-sidebar border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("status")}
              </label>
              <Select
                value={formData.status?.toString()}
                onValueChange={(value) => handleInputChange("status", parseInt(value))}
              >
                <SelectTrigger className="bg-sidebar border-gray-700">
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t("active")}</SelectItem>
                  <SelectItem value="0">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full">
              {editingInsurance ? t("update") : t("add")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
