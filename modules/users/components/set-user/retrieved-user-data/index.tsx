import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import QConfirmData from "./QConfirmData";
import DataConfirmed from "./DataConfirmed";

export default function RecivedUserDataDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        {/* <QConfirmData /> */}
        <DataConfirmed />
      </DialogContent>
    </Dialog>
  );
}
