"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import { toast } from "sonner";
import { z } from "zod";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Types
export interface WorkOrderFormData {
  consultantCode: string;
  workOrderDescription: string;
  workOrderType: string;
  taskId: string;
  procedureId: string;
}

export interface WorkOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workOrderId?: string;
}

// Mock data for dropdowns (replace with actual API calls)
const mockTasks = [
  { id: "task1", name: "Task 1" },
  { id: "task2", name: "Task 2" },
  { id: "task3", name: "Task 3" },
];

const mockProcedures = [
  { id: "proc1", name: "Procedure 1" },
  { id: "proc2", name: "Procedure 2" },
  { id: "proc3", name: "Procedure 3" },
];

// Mock work order data
const mockWorkOrders = [
  {
    id: "id124",
    consultantCode: 400,
    workOrderDescription: "توصيل عداد بحفرية شبكة ارضية",
    workOrderType: 402,
    taskId: "task1",
    procedureId: "proc1",
  },
  {
    id: "id125",
    consultantCode: 401,
    workOrderDescription: "Second work order description",
    workOrderType: 403,
    taskId: "task2",
    procedureId: "proc2",
  },
  {
    id: "id126",
    consultantCode: 402,
    workOrderDescription: "Third work order description",
    workOrderType: 404,
    taskId: "task3",
    procedureId: "proc3",
  },
  {
    id: "id127",
    consultantCode: 403,
    workOrderDescription: "Fourth work order description",
    workOrderType: 405,
    taskId: "task1",
    procedureId: "proc2",
  },
];

// Form schema
const createWorkOrderFormSchema = (t: any) => {
  return z.object({
    consultantCode: z
      .string()
      .min(1, t("consultantCodeRequired"))
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        t("consultantCodeRequired"),
      ),
    workOrderDescription: z.string().min(1, t("workOrderDescriptionRequired")),
    workOrderType: z
      .string()
      .min(1, t("workOrderTypeRequired"))
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        t("workOrderTypeRequired"),
      ),
    taskId: z.string().min(1, t("taskRequired")),
    procedureId: z.string().min(1, t("procedureRequired")),
  });
};

const getDefaultWorkOrderFormValues = (): WorkOrderFormData => ({
  consultantCode: "",
  workOrderDescription: "",
  workOrderType: "",
  taskId: "",
  procedureId: "",
});

export default function EditWorkOrderDialog({
  open,
  onClose,
  onSuccess,
  workOrderId,
}: WorkOrderDialogProps) {
  const t = useTranslations("work-orders");
  const tForm = useTranslations("work-orders.form");
  const isEditMode = !!workOrderId;

  // Mock fetch work order data when editing (replace with actual API call)
  const { data: workOrderData, isLoading: isFetching } = useQuery({
    queryKey: ["workOrder", workOrderId],
    queryFn: async () => {
      if (!workOrderId) return null;

      // Find work order from mock data
      const workOrder = mockWorkOrders.find((wo) => wo.id === workOrderId);

      return {
        payload: workOrder || {
          consultantCode: 0,
          workOrderDescription: "",
          workOrderType: 0,
          taskId: "",
          procedureId: "",
        },
      };
    },
    enabled: isEditMode && open && !!workOrderId,
  });

  const form = useForm({
    resolver: zodResolver(createWorkOrderFormSchema(tForm)),
    defaultValues: getDefaultWorkOrderFormValues(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(tForm("validationError"));
      }
    }
  }, [errors]);

  // Reset form to default values when opening Add dialog
  useEffect(() => {
    if (open && !isEditMode) {
      reset(getDefaultWorkOrderFormValues());
    }
  }, [open, isEditMode, reset]);

  // Populate form with work order data when editing
  useEffect(() => {
    if (isEditMode && workOrderData?.payload) {
      const workOrder = workOrderData.payload;
      reset({
        consultantCode: workOrder.consultantCode?.toString() || "",
        workOrderDescription: workOrder.workOrderDescription || "",
        workOrderType: workOrder.workOrderType?.toString() || "",
        taskId: workOrder.taskId || "",
        procedureId: workOrder.procedureId || "",
      });
    }
  }, [isEditMode, workOrderData, open, reset]);

  const onSubmit = async (data: WorkOrderFormData) => {
    try {
      // Convert string numbers to actual numbers for API
      const apiData = {
        ...data,
        consultantCode: parseInt(data.consultantCode) || 0,
        workOrderType: parseInt(data.workOrderType) || 0,
      };

      // Replace with actual API calls
      if (isEditMode && workOrderId) {
        // await WorkOrderApi.update(workOrderId, apiData);
        console.log("Updating work order:", apiData);
      } else {
        // await WorkOrderApi.create(apiData);
        console.log("Creating work order:", apiData);
      }

      toast.success(
        isEditMode ? tForm("updateSuccess") : tForm("createSuccess"),
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} work order:`,
        error,
      );
      toast.error(isEditMode ? tForm("updateError") : tForm("createError"));
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      maxWidth={"lg"}
      PaperProps={{
        sx: {
          color: "white",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          p: 8,
        },
      }}
      
    >
      <DialogContent className="max-w-6xl w-full bg-sidebar">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {t("editWorkOrder")}
          </DialogTitle>
        </DialogHeader>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Consultant Code and Work Order Type - 2 Column Grid */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={control}
                name="consultantCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {tForm("consultantCode")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1 bg-sidebar border-gray-700"
                        placeholder={tForm("consultantCodePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="workOrderDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {tForm("workOrderDescription")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1 bg-sidebar border-gray-700"
                        placeholder={tForm("workOrderDescriptionPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="workOrderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {tForm("workOrderType")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1 bg-sidebar border-gray-700"
                        placeholder={tForm("workOrderTypePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Task and Procedure Dropdowns - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="taskId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {tForm("addTask")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || isFetching}
                    >
                      <FormControl>
                        <SelectTrigger className="mt-1 bg-sidebar border-gray-700">
                          <SelectValue placeholder={tForm("selectTask")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockTasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="procedureId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {tForm("addProcedure")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || isFetching}
                    >
                      <FormControl>
                        <SelectTrigger className="mt-1 bg-sidebar border-gray-700">
                          <SelectValue placeholder={tForm("selectProcedure")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockProcedures.map((procedure) => (
                          <SelectItem key={procedure.id} value={procedure.id}>
                            {procedure.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full"
              >
                {(isSubmitting || isFetching) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tForm("save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
