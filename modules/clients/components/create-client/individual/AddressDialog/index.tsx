import { useModal } from "@/hooks/use-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import AddressFormContent from "./AddressFormContent";
import AddressMapComponent from "./map/MapComponent";
import { useFormStore } from "@/modules/form-builder";
import { MapIcon } from "lucide-react";

export default function AddressDialog({ formId }: { formId: string }) {
  // declare and define vars and states
  const t = useTranslations("ClientsModule.dialog");
  const [isOpen, handleOpen, handleClose] = useModal();

  return (
    <>
      <Button variant={"ghost"} className="underline justify-start" onClick={handleOpen}>
        <MapIcon /> {t("triggerText")}
      </Button>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px] md:min-w-[50rem] gap-8 min-h-[15rem]">
          <DialogTitle className="flex justify-center items-center">
            {t("title")}
          </DialogTitle>
          <AddressFormContent formId={formId} handleClose={handleClose}/>
        </DialogContent>
      </Dialog>
    </>
  );
}
