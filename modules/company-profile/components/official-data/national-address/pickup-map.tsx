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
import LocationSelector from "./map-dialog";

const PickupMap = ({
  formId,
  lat,
  long,
}: {
  formId: string;
  lat: string;
  long: string;
}) => {
  const [isOpen, handleOpen, handleClose] = useModal();
  const { setValue } = useFormStore();
  //   setValue(formId , 'street_name' , 'aaaaaaaaa')

  const handleSaveMap = (obj: any) => {
    setValue(formId, "city_id", obj.city_id);
    setValue(formId, "state_id", obj.state_id);
    setValue(formId, "postal_code", obj.postal_code);
    setValue(formId, "street_name", obj.street_name);
    setValue(formId, "neighborhood_name", obj.neighborhood_name);

    handleClose();
  };

  return (
    <>
      <div
        className={
          "relative border col-span-2 h-10 rounded-md flex items-center justify-between px-3"
        }
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
            initialLocation={{
              latitude: parseFloat(lat),
              longitude: parseFloat(long),
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PickupMap;
