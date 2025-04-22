import { PreviewTextFieldType } from ".";
import pdfImg from "@/assets/icons/PDF.png";
import ImageIcon from "@/public/icons/image-icon";

type PropsT = {
  type?: PreviewTextFieldType;
};

export default function PreviewTextFieldPrefixIcon({ type }: PropsT) {
  // show pdf icon if type is 'pdf'
  if (type === "pdf") {
    return <img src={pdfImg.src} width="25px" height="25px" alt="pdf file" />;
  }

  // show image icon if type is 'image'
  if (type === "image") {
    return <ImageIcon additionalClass="text-primary text-lg" />;
  }

  // other types, render nothing
  return <></>;
}
