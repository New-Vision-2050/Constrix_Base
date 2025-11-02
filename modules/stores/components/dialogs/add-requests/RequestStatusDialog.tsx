"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  getAvailableStatuses,
  getOrderDetails,
  updateOrderStatus,
} from "@/services/api/ecommerce/orders";
import { useIsRtl } from "@/hooks/use-is-rtl";

interface RequestStatusDialogProps {
  open: boolean;
  onClose: () => void;
  requestId?: string;
  onSuccess?: () => void;
}

interface StatusOption {
  status: string;
  label: string;
  color: string;
}

export function RequestStatusDialog({
  open,
  onClose,
  requestId,
  onSuccess,
}: RequestStatusDialogProps) {
  const t = useTranslations("requests");
  const [loading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const isRtl = useIsRtl();

  // Fetch status options
  useEffect(() => {
    if (open) {
      fetchStatusOptions();
    }
  }, [open]);

  // Fetch current request data if editing
  useEffect(() => {
    if (open && requestId) {
      fetchRequestData();
    }
  }, [open, requestId]);

  const fetchStatusOptions = async () => {
    if (!requestId) return;

    try {
      setLoadingStatuses(true);
      const response = await getAvailableStatuses(requestId);
      if (response.payload?.available_statuses) {
        setStatusOptions(response.payload.available_statuses);
      }
    } catch (error) {
      console.error("Error fetching status options:", error);
      toast.error(
        t("errors.fetchStatusesFailed") || "Failed to fetch status options"
      );
    } finally {
      setLoadingStatuses(false);
    }
  };

  const fetchRequestData = async () => {
    if (!requestId) return;

    try {
      const response = await getOrderDetails(requestId);
      if (response.payload?.current_status) {
        setSelectedStatus(response.payload.current_status);
      }
    } catch (error) {
      console.error("Error fetching request data:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus || !requestId) {
      toast.error(t("errors.selectStatus") || "Please select a status");
      return;
    }

    try {
      setLoading(true);
      await updateOrderStatus(requestId, {
        order_status: selectedStatus,
      });

      toast.success(
        t("success.statusUpdated") || "Request status updated successfully"
      );
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      console.error("Error updating request status:", error);
      toast.error(
        error?.response?.data?.message ||
          t("errors.updateFailed") ||
          "Failed to update request status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-2xl w-full bg-sidebar border-gray-700 ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {t("dialog.title") || "تعديل حالة الطلب"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">
              {t("dialog.statusLabel") || "الطلب معلق"}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              disabled={loadingStatuses}
            >
              <SelectTrigger id="status">
                <SelectValue
                  placeholder={t("dialog.selectStatus") || "اختر الحالة"}
                />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((statusOption) => (
                  <SelectItem
                    key={statusOption.status}
                    value={statusOption.status}
                  >
                    <span className={`text-${statusOption.color}-500`}>
                      {statusOption.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {t("dialog.cancel") || "الغاء"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !selectedStatus}>
            {loading
              ? t("dialog.saving") || "جاري الحفظ..."
              : t("dialog.save") || "حفظ"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
