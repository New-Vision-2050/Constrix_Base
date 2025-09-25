import Image from "next/image";
import PDFIcon from "@/assets/icons/PDF.png";
import { Checkbox } from "@/components/ui/checkbox";

export default function GridItem() {
  return (
    <div className="w-[220px] rounded-lg p-4 flex flex-col items-center justify-between relative">
      <Image src={PDFIcon} alt="PDF" width={50} height={50} />
      <p className="text-center text-lg font-medium">الملف الفني - 2024</p>
      <p className="text-center text-sm font-light">27 يناير</p>
      <p className="text-center text-sm font-light">3.5 MB</p>
      <Checkbox className="absolute top-2 right-2" />
    </div>
  );
}
