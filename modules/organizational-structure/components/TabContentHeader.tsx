import { Button } from "@/components/ui/button";
import { ArrowRightFromLine, PrinterIcon } from "lucide-react";

type PropsT = {
  title?: string;
};

export default function TabContentHeader(props: PropsT) {
  const { title } = props;

  return (
    <div className="flex w-full items-center justify-between gap-4 p-6 bg-sidebar rounded-lg">
      <p className="text-lg font-bold">{title}</p>
      <div className="flex items-center gap-4">
        <Button color="primary">
          <ArrowRightFromLine />
          PDF
        </Button>
        <Button color="primary">
          <PrinterIcon />
          طباعة
        </Button>
      </div>
    </div>
  );
}
