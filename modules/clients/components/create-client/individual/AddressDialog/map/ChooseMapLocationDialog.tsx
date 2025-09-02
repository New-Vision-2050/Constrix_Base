import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import AddressMapComponent from "./MapComponent";
import { useFormStore } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";

export default function ChooseMapLocationDialog() {
  const [isOpen, handleOpen, handleClose] = useModal();
  return (
    <>
      <Button variant={"ghost"} onClick={handleOpen} className="flex items-start underline justify-start gap-2">
        <MapIcon /> أختر الموقع على الخريطة
      </Button>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] md:min-w-[50rem] gap-8 min-h-[15rem]">
          <DialogTitle className="flex justify-center items-center">
            أختر الموقع على الخريطة
          </DialogTitle>
          <AddressMapComponent
            formId="address-individual-client-form"
            onMapClick={(lat, lng, locationInfo) => {
              // update form values
              useFormStore
                .getState()
                .setValues("address-individual-client-form", {
                  latitude: lat,
                  longitude: lng,
                  area: locationInfo?.city,
                  neighborhood_name: locationInfo?.district,
                  street_name: locationInfo?.street,
                  fullAddress: locationInfo?.fullAddress,
                });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
