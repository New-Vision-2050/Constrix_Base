import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { useFormStore } from "@/modules/form-builder";
import { MapPin } from "lucide-react";
import React from "react";
import LocationSelector from "./LocationSelector";
import { cn } from "@/lib/utils";

const defaultKeys = [
  "city_id",
  "state_id",
  "postal_code",
  "street_name",
  "neighborhood_name",
];

const PickupMap = ({
  formId,
  lat,
  long,
  containerClassName,
  keysToUpdate,
  inGeneral = false,
  branchId,
  companyId,
}: {
  formId: string;
  lat?: string;
  long?: string;
  containerClassName?: string;
  keysToUpdate?: string[];
  inGeneral?: boolean;
  branchId?: string;
  companyId?: string;
}) => {
  const [isOpen, handleOpen, handleClose] = useModal();
  const { setValue } = useFormStore();

  const handleSaveMap = (obj: Record<string, string | number | undefined>) => {
    const keys = keysToUpdate ?? defaultKeys;
    keys.forEach((key) => {
      if (obj[key] !== undefined) {
        setValue(formId, key, obj[key]);
      }
    });

    handleClose();
  };

  return (
    <>
      <div
        className={cn(
          "relative border h-10 rounded-md flex items-center justify-between px-3",
          containerClassName
        )}
      >
        <div className="flex w-full items-center gap-2">
          <MapPin className="text-primary w-4" />
          <button onClick={handleOpen} type="button" className="underline">
            اظهار الموقع من الخريطة
          </button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent withCrossButton className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center my-5">
              تعديل احداثيات موقع العنوان الوطني
            </DialogTitle>
          </DialogHeader>
          <LocationSelector
            onSave={handleSaveMap}
            {...(!!lat && !!long
              ? {
                  initialLocation: {
                    latitude: parseFloat(lat),
                    longitude: parseFloat(long),
                  },
                }
              : {})}
            inGeneral={inGeneral}
            branchId={branchId}
            companyId={companyId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PickupMap;
