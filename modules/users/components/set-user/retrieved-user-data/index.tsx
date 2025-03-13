import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import QConfirmData from "./QConfirmData";
import DataConfirmed from "./DataConfirmed";
import { useState } from "react";

type PropsT = {
  uId?: string;
  companyId?: string;
};
export default function RecivedUserDataDialog({ uId, companyId }: PropsT) {
  const [confirm, setConfirm] = useState(false);

  return (
    <Dialog>
      <DialogTrigger className="text-[#f42589]">
        اضغط هنا لاسترجاع بياناتك.
      </DialogTrigger>
      <DialogContent>
        {confirm ? (
          <DataConfirmed />
        ) : (
          <QConfirmData
            uId={uId}
            companyId={companyId}
            setConfirm={setConfirm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
